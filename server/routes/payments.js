const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Order } = require('../models');
const { verifyToken, verifyCsrf } = require('../middleware/auth');

// POST /api/payments/razorpay/order - Create Razorpay order
router.post('/razorpay/order', verifyToken, verifyCsrf, async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required.' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized payment attempt.' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_T8iolO9ScepH95';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Knlb9Gm3JitKaES1027c3aMA';
    const amountInPaise = Math.round(order.totalAmount * 100);

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `order_${order._id}`,
      }),
    });

    const rzpOrder = await rzpResponse.json();
    if (!rzpResponse.ok) {
      return res.status(400).json({ error: rzpOrder.error ? rzpOrder.error.description : 'Failed to create Razorpay order' });
    }

    res.json({
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: keyId,
      order: order,
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ error: 'Server error initiating Razorpay payment.' });
  }
});

// POST /api/payments/razorpay/verify - Verify Razorpay payment signature
router.post('/razorpay/verify', verifyToken, verifyCsrf, async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required Razorpay verification details.' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized verification attempt.' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Knlb9Gm3JitKaES1027c3aMA';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.paymentMethod = 'razorpay';
      await order.save();
      return res.json({ message: 'Payment verified successfully.', order });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ error: 'Invalid payment signature. Verification failed.' });
    }
  } catch (err) {
    console.error('Razorpay verification error:', err);
    res.status(500).json({ error: 'Server error verifying payment.' });
  }
});

// POST /api/payments/charge - Mock Stripe charge simulation
router.post('/charge', verifyToken, verifyCsrf, async (req, res) => {
  const { orderId, cardToken } = req.body;

  if (!orderId || !cardToken) {
    return res.status(400).json({ error: 'Order ID and payment token are required.' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized payment attempt.' });
    }

    if (cardToken === 'tok_charge_fail') {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({
        error: 'The simulated card transaction was declined. Please try another card.',
        order,
      });
    }

    order.paymentStatus = 'paid';
    order.status = 'processing';
    await order.save();

    res.json({
      message: 'Payment simulation succeeded. Order is now processing.',
      order,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error processing payment.' });
  }
});

module.exports = router;
