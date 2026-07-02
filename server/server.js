require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Method Allow-list
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'];
app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
  next();
});

// Security Middleware: Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' blob: data: https:; frame-ancestors 'none';");
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// CORS configuration - Allow Vite frontend client credentials exchange
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://furnova-wheat.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically (non-executable directory)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database (no auto-seeding — products are managed via admin panel)
connectDB();


// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/settings', require('./routes/settings'));


// Error handling fallback (generic message to client, logged securely)
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({ error: 'A secure server error occurred. Please try again later.' });
});

// Listen ONLY on loopback address (127.0.0.1) as required by security guide
if (require.main === module) {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Furnova backend server is running securely on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app; // Export for testing
