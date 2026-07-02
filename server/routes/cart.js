const express = require('express');
const router = express.Router();
const { Cart, Product } = require('../models');
const { verifyToken, verifyCsrf } = require('../middleware/auth');

// GET /api/cart - Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving your cart.' });
  }
});

// POST /api/cart - Add or update cart items
router.post('/', verifyToken, verifyCsrf, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined || quantity <= 0) {
    return res.status(400).json({ error: 'Product ID and a positive quantity are required.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: `Only ${product.stock} items left in stock.` });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    let items = [...cart.items];
    const itemIndex = items.findIndex(item => item.productId === productId.toString());

    if (itemIndex > -1) {
      // Update quantity
      items[itemIndex].quantity = parseInt(quantity);
    } else {
      // Add new item
      items.push({
        productId: product._id.toString(),
        name: product.name,
        price: parseFloat(product.price),
        image: product.images[0] || '',
        quantity: parseInt(quantity),
      });
    }

    cart.items = items;
    await cart.save();
    res.json({ message: 'Cart updated successfully.', cart });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating your cart.' });
  }
});

// DELETE /api/cart/items/:productId - Remove item from cart
router.delete('/items/:productId', verifyToken, verifyCsrf, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    let items = cart.items.filter(item => item.productId !== productId.toString());

    cart.items = items;
    await cart.save();
    res.json({ message: 'Item removed from cart.', cart });
  } catch (err) {
    res.status(500).json({ error: 'Server error removing item from cart.' });
  }
});

// POST /api/cart/clear - Clear all items
router.post('/clear', verifyToken, verifyCsrf, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully.', cart });
  } catch (err) {
    res.status(500).json({ error: 'Server error clearing cart.' });
  }
});

module.exports = router;
