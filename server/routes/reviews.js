const express = require('express');
const router = express.Router();
const { Review, Product, User } = require('../models');
const { verifyToken, verifyCsrf } = require('../middleware/auth');

// GET /api/reviews/product/:productId - Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving reviews.' });
  }
});

// POST /api/reviews - Submit a product review
router.post('/', verifyToken, verifyCsrf, async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: 'Product ID, rating (1-5), and review text comment are required.' });
  }

  const numericRating = parseInt(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Rating must be a whole number between 1 and 5.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Find the reviewer's name
    const user = await User.findById(req.user.id);
    const userName = user ? user.name : 'Verified Buyer';

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      userName,
      productId: productId.toString(),
      rating: numericRating,
      comment,
    });

    // Recompute average rating for this product
    const allReviews = await Review.find({ productId });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = parseFloat((totalRating / allReviews.length).toFixed(1));

    product.ratings = avgRating;
    await product.save();

    res.status(201).json({ message: 'Review submitted successfully.', review, newAverageRating: avgRating });
  } catch (err) {
    res.status(500).json({ error: 'Server error posting review.' });
  }
});

module.exports = router;
