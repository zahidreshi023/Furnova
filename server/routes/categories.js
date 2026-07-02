const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Category } = require('../models');
const { verifyToken, isAdmin, verifyCsrf } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/categories - List all categories with subcategories
router.get('/', async (req, res) => {
  try {
    const { flat } = req.query;
    if (flat === 'true') {
      const categories = await Category.find().populate('parentCategory');
      return res.json(categories);
    }
    const categories = await Category.find({ parentCategoryId: null })
      .populate('subCategories');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving categories.' });
  }
});

// POST /api/categories - Create a category (Admin only)
// Accepts multipart/form-data with optional 'image' file
router.post('/', verifyToken, isAdmin, verifyCsrf, upload.single('image'), async (req, res) => {
  const { name, parentCategoryId } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  try {
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Category name already exists.' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.filename ? `/uploads/${req.file.filename}` : req.file.path;
    }

    const category = await Category.create({
      name,
      image: imageUrl,
      parentCategoryId: parentCategoryId || null,
    });

    res.status(201).json({ message: 'Category created successfully.', category });
  } catch (err) {
    res.status(500).json({ error: 'Server error creating category.' });
  }
});

// PUT /api/categories/:id - Update a category (Admin only)
// Accepts multipart/form-data with optional 'image' file
router.put('/:id', verifyToken, isAdmin, verifyCsrf, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Check for duplicate name (excluding current category)
    const existing = await Category.findOne({ name, _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ error: 'Category name already exists.' });
    }

    // Handle image upload - delete old file if replacing
    if (req.file) {
      // Delete old uploaded image from disk if it was a local upload
      if (category.image && category.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', category.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      category.image = req.file.filename ? `/uploads/${req.file.filename}` : req.file.path;
    }

    category.name = name;
    await category.save();

    res.json({ message: 'Category updated successfully.', category });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating category.' });
  }
});

// DELETE /api/categories/:id - Delete a category (Admin only)
router.delete('/:id', verifyToken, isAdmin, verifyCsrf, async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Delete uploaded image from disk
    if (category.image && category.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', category.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    // Unset parent reference on subcategories
    await Category.updateMany({ parentCategoryId: id }, { parentCategoryId: null });

    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting category.' });
  }
});

module.exports = router;
