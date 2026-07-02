const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  parentCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to populate subcategories referencing parentCategoryId
categorySchema.virtual('subCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategoryId'
});

categorySchema.virtual('parentCategory', {
  ref: 'Category',
  localField: 'parentCategoryId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Category', categorySchema);
