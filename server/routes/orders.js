const express = require('express');
const router = express.Router();
const { Order, Product, Cart } = require('../models');
const { verifyToken, isAdmin, verifyCsrf } = require('../middleware/auth');

// GET /api/orders - Get logged-in user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving orders.' });
  }
});

// GET /api/orders/all - Get all orders (Admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving all orders.' });
  }
});

// POST /api/orders - Create an order from cart items
router.post('/', verifyToken, verifyCsrf, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ error: 'Shipping address and payment method are required.' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Your shopping cart is empty.' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock availability and compute totals
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product '${item.name}' not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product '${product.name}'. Only ${product.stock} units remaining.`,
        });
      }

      totalAmount += parseFloat(product.price) * item.quantity;
      orderItems.push({
        productId: product._id.toString(),
        name: product.name,
        price: parseFloat(product.price),
        image: item.image,
        quantity: item.quantity,
      });
    }

    // Deduct stock levels
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      product.stock = product.stock - item.quantity;
      await product.save();
    }

    // Create the order record
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      status: paymentMethod === 'cod' ? 'processing' : 'pending',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || 'cod',
      shippingAddress,
    });

    // Clear cart items
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    res.status(500).json({ error: 'Server error processing order.' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', verifyToken, isAdmin, verifyCsrf, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status code.' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated successfully.', order });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating order status.' });
  }
});

// PUT /api/orders/:id/payment - Update order payment status (Admin or Webhook)
router.put('/:id/payment', verifyToken, verifyCsrf, async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  const validPaymentStatuses = ['pending', 'paid', 'failed'];
  if (!validPaymentStatuses.includes(paymentStatus)) {
    return res.status(400).json({ error: 'Invalid payment status code.' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Check ownership unless admin
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ message: 'Order payment status updated successfully.', order });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating payment status.' });
  }
});

module.exports = router;
