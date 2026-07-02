const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { User, Product, Cart } = require('../models');

// Configure test environment variables before tests run
process.env.JWT_SECRET_KEY = 'test-secret-key-that-is-at-least-32-chars-long';
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  // Establish database connection
  await connectDB();
  // Clear any existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
});

afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});

describe('Furnova API Endpoints Suite', () => {
  let customerCookie = '';
  let customerCsrf = '';
  let adminCookie = '';
  let adminCsrf = '';
  let testProductId = null;
  let testOrderId = null;

  // 1. Auth Endpoint Tests
  describe('Authentication Route Checks', () => {
    it('should refuse registration with short password (< 8 chars)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Pass User',
          email: 'short@example.com',
          password: 'short',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Password must be at least 8 characters');
    });

    it('should successfully register a customer', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'securePassword123!',
        });
      expect(res.statusCode).toBe(201);
    });

    it('should successfully register a second user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'adminSecurePassword123!',
        });
      expect(res.statusCode).toBe(201);
    });

    it('should configure roles and retrieve cookies for customer and admin', async () => {
      // Demote first registered user to customer in database
      const customer = await User.findOne({ email: 'john@example.com' });
      customer.role = 'customer';
      await customer.save();

      // Escalate second registered user to admin in database
      const admin = await User.findOne({ email: 'admin@example.com' });
      admin.role = 'admin';
      await admin.save();

      // Log in customer to retrieve signed cookie & CSRF token
      const customerLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'securePassword123!',
        });
      expect(customerLogin.statusCode).toBe(200);
      customerCookie = customerLogin.headers['set-cookie'][0];
      customerCsrf = customerLogin.body.csrfToken;

      // Log in admin to retrieve signed cookie & CSRF token
      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'adminSecurePassword123!',
        });
      expect(adminLogin.statusCode).toBe(200);
      adminCookie = adminLogin.headers['set-cookie'][0];
      adminCsrf = adminLogin.body.csrfToken;
    });

    it('should block logins with invalid passwords', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongPassword',
        });
      expect(res.statusCode).toBe(401);
    });
  });

  // 2. Product Catalog Route Tests
  describe('Product Catalog Route Checks', () => {
    it('should allow admin to create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .set('x-csrf-token', adminCsrf)
        .send({
          name: 'Minimalist Dining Chair',
          category: 'Chairs',
          description: 'A beautiful walnut dining chair with ivory padding.',
          price: 129.99,
          stock: 10,
          material: 'Walnut & Linen',
          color: 'Ivory',
          images: ['https://example.com/chair.jpg'],
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.product.name).toBe('Minimalist Dining Chair');
      testProductId = res.body.product.id;
    });

    it('should forbid customer from creating products', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', customerCookie)
        .set('x-csrf-token', customerCsrf)
        .send({
          name: 'Hacker Table',
          category: 'Tables',
          price: 9.99,
          stock: 1,
        });
      expect(res.statusCode).toBe(403);
    });

    it('should retrieve list of products with filters', async () => {
      const res = await request(app)
        .get('/api/products')
        .query({ category: 'Chairs', search: 'walnut' });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve product detail by ID', async () => {
      const res = await request(app).get(`/api/products/${testProductId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Minimalist Dining Chair');
    });
  });

  // 3. Cart Route Tests
  describe('Cart Operation Checks', () => {
    it('should fetch empty cart for new customer', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Cookie', customerCookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.items.length).toBe(0);
    });

    it('should add items to the cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Cookie', customerCookie)
        .set('x-csrf-token', customerCsrf)
        .send({
          productId: testProductId,
          quantity: 2,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.cart.items.length).toBe(1);
      expect(res.body.cart.items[0].quantity).toBe(2);
    });

    it('should reject quantities exceeding stock limits', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Cookie', customerCookie)
        .set('x-csrf-token', customerCsrf)
        .send({
          productId: testProductId,
          quantity: 200, // Stock is 10
        });
      expect(res.statusCode).toBe(400);
    });
  });

  // 4. Order Checkout & Payment Tests
  describe('Checkout Processing Checks', () => {
    it('should successfully place an order from cart items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Cookie', customerCookie)
        .set('x-csrf-token', customerCsrf)
        .send({
          shippingAddress: {
            name: 'John Doe',
            street: '123 Forest Lane',
            city: 'Seattle',
            state: 'WA',
            zip: '98101',
            phone: '555-0199',
          },
          paymentMethod: 'card',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.order.status).toBe('pending');
      expect(res.body.order.items.length).toBe(1);
      testOrderId = res.body.order.id;

      // Verify cart got cleared
      const cartRes = await request(app)
        .get('/api/cart')
        .set('Cookie', customerCookie);
      expect(cartRes.body.items.length).toBe(0);
    });

    it('should mock Stripe payment successfully', async () => {
      const res = await request(app)
        .post('/api/payments/charge')
        .set('Cookie', customerCookie)
        .set('x-csrf-token', customerCsrf)
        .send({
          orderId: testOrderId,
          cardToken: 'tok_charge_success',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.order.paymentStatus).toBe('paid');
      expect(res.body.order.status).toBe('processing');
    });

    it('should verify order is recorded in history', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Cookie', customerCookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].id).toBe(testOrderId);
    });
  });
});
