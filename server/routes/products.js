const express = require('express');
const router = express.Router();
const { Product, Review } = require('../models');
const { verifyToken, isAdmin, verifyCsrf } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/products - List products with live search, filters, and sorting
router.get('/', async (req, res) => {
  const { category, search, minPrice, maxPrice, material, color, sortBy } = req.query;

  const whereClause = {};

  // Category filter
  if (category) {
    whereClause.category = category;
  }

  // Price range filters
  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) {
      whereClause.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      whereClause.price.$lte = parseFloat(maxPrice);
    }
  }

  // Material filter
  if (material) {
    whereClause.material = material;
  }

  // Color filter
  if (color) {
    whereClause.color = color;
  }

  // Search term (name, category, or description) using parameterized regex
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    whereClause.$or = [
      { name: searchRegex },
      { category: searchRegex },
      { description: searchRegex },
    ];
  }

  // Sorting definitions
  let sortClause = { createdAt: -1 }; // default to newest
  if (sortBy) {
    if (sortBy === 'price_low') {
      sortClause = { price: 1 };
    } else if (sortBy === 'price_high') {
      sortClause = { price: -1 };
    } else if (sortBy === 'rating') {
      sortClause = { ratings: -1 };
    }
  }

  try {
    const products = await Product.find(whereClause).sort(sortClause);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving furniture products.' });
  }
});

// GET /api/products/:id - Details of a specific product with reviews
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Furniture item not found.' });
    }

    const reviews = await Review.find({ productId: id }).sort({ createdAt: -1 });

    const productObj = product.toObject();
    productObj.Reviews = reviews; // Capitalized to match client expectations

    res.json(productObj);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving product details.' });
  }
});

// POST /api/products - Create new product (Admin only) with file upload
router.post('/', verifyToken, isAdmin, verifyCsrf, upload.array('images', 5), async (req, res) => {
  const { name, category, description, dimensions, material, color, price, stock } = req.body;

  if (!name || !category || !price || stock === undefined) {
    return res.status(400).json({ error: 'Name, category, price, and stock are required fields.' });
  }

  // Build images array from uploaded files
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map(f => f.filename ? `/uploads/${f.filename}` : f.path);
  }
  // Also accept existing image URLs passed as JSON string (for keeping old images)
  if (req.body.existingImages) {
    try {
      const existing = JSON.parse(req.body.existingImages);
      if (Array.isArray(existing)) {
        images = [...existing, ...images];
      }
    } catch (e) {
      // Ignore parse errors for existingImages
    }
  }

  try {
    const product = await Product.create({
      name,
      category,
      description: description || '',
      dimensions: dimensions || '',
      material: material || '',
      color: color || '',
      price: parseFloat(price),
      stock: parseInt(stock),
      images,
      ratings: 0.0,
    });

    res.status(201).json({ message: 'Furniture item created successfully.', product });
  } catch (err) {
    res.status(500).json({ error: 'Server error creating product.' });
  }
});

// PUT /api/products/:id - Update product details (Admin only) with file upload
router.put('/:id', verifyToken, isAdmin, verifyCsrf, upload.array('images', 5), async (req, res) => {
  const { id } = req.params;
  const { name, category, description, dimensions, material, color, price, stock } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Furniture item not found.' });
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (dimensions !== undefined) product.dimensions = dimensions;
    if (material !== undefined) product.material = material;
    if (color !== undefined) product.color = color;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);

    // Handle images: keep existing ones specified, add new uploads
    let images = [];
    if (req.body.existingImages) {
      try {
        const existing = JSON.parse(req.body.existingImages);
        if (Array.isArray(existing)) {
          images = [...existing];
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => f.filename ? `/uploads/${f.filename}` : f.path);
      images = [...images, ...newImages];
    }
    // Only update images if new data was provided
    if (images.length > 0 || req.body.existingImages !== undefined) {
      product.images = images;
    }

    await product.save();

    res.json({ message: 'Furniture item updated successfully.', product });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating product.' });
  }
});

// DELETE /api/products/all - Delete ALL products (Admin only)
router.delete('/all', verifyToken, isAdmin, verifyCsrf, async (req, res) => {
  try {
    await Review.deleteMany({});
    const result = await Product.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} products and all reviews.` });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting all products.' });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyToken, isAdmin, verifyCsrf, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Furniture item not found.' });
    }

    // Delete associated reviews
    await Review.deleteMany({ productId: id });

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Furniture item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting product.' });
  }
});

module.exports = router;
