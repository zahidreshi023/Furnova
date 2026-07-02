const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const { verifyToken, isAdmin, verifyCsrf } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Default contact settings
const DEFAULT_CONTACT_SETTINGS = {
  phone: '1-800-FURNOVA (387-6682)',
  email: 'support@furnova.com',
  hours: 'Mon - Sun (9:00 AM - 8:00 PM EST)',
  showrooms: [
    {
      name: 'Seattle Flagship Showroom',
      address: '1024 Pine Street, Seattle, WA 98101',
      hours: 'Mon - Sun (10:00 AM - 7:00 PM)',
      phone: '1-800-387-6682 (Ext. 101)',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop',
    },
    {
      name: 'San Francisco Showroom',
      address: '450 Sutter Street, San Francisco, CA 94108',
      hours: 'Mon - Sat (10:00 AM - 6:00 PM)',
      phone: '1-800-387-6682 (Ext. 102)',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop',
    },
    {
      name: 'New York Flatiron Showroom',
      address: '120 Fifth Ave, New York, NY 10011',
      hours: 'Mon - Sun (10:00 AM - 8:00 PM)',
      phone: '1-800-387-6682 (Ext. 103)',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop',
    },
  ]
};

// Default branding settings
const DEFAULT_BRANDING = {
  siteName: 'Furnova',
  logoUrl: '',
};

// Default banner slides
const DEFAULT_BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop',
    headline: 'Elevate Your Living Space',
    subtitle: 'Discover hand-crafted furniture collection. Impeccable wood finishes, premium upholstery fabrics.',
    ctaText: 'Shop Collection',
    ctaLink: '/products',
  },
  {
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200&auto=format&fit=crop',
    headline: 'Crafted in Elegance',
    subtitle: 'Every piece undergoes a rigorous 14-stage dry-kiln curing process for decades of durability.',
    ctaText: 'Explore Tables',
    ctaLink: '/products?category=Tables',
  },
  {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop',
    headline: 'Luxury Sofas Collection',
    subtitle: 'Sink into premium comfort with our hand-stitched velvet and leather sofas.',
    ctaText: 'View Sofas',
    ctaLink: '/products?category=Sofas',
  },
];

// ========================
// CONTACT SETTINGS
// ========================

// GET /api/settings/contact
router.get('/contact', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'contact_settings' });
    if (!setting) {
      return res.json(DEFAULT_CONTACT_SETTINGS);
    }
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving contact settings.' });
  }
});

// PUT /api/settings/contact (Admin only)
router.put('/contact', verifyToken, isAdmin, verifyCsrf, async (req, res) => {
  const { phone, email, hours, showrooms } = req.body;

  if (!phone || !email || !hours || !Array.isArray(showrooms)) {
    return res.status(400).json({ error: 'Phone, email, hours, and showrooms array are required.' });
  }

  try {
    let setting = await Setting.findOne({ key: 'contact_settings' });
    const newValue = { phone, email, hours, showrooms };

    if (!setting) {
      setting = await Setting.create({
        key: 'contact_settings',
        value: newValue,
      });
    } else {
      setting.value = newValue;
      setting.markModified('value');
      await setting.save();
    }

    res.json({ message: 'Contact settings updated successfully.', settings: setting.value });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating contact settings.' });
  }
});

// ========================
// BRANDING SETTINGS (Logo + Site Name)
// ========================

// GET /api/settings/branding
router.get('/branding', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'branding_settings' });
    if (!setting) {
      return res.json(DEFAULT_BRANDING);
    }
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving branding settings.' });
  }
});

// PUT /api/settings/branding (Admin only) - supports logo file upload
router.put('/branding', verifyToken, isAdmin, verifyCsrf, upload.single('logo'), async (req, res) => {
  const { siteName } = req.body;

  try {
    let setting = await Setting.findOne({ key: 'branding_settings' });
    const newValue = {
      siteName: siteName || 'Furnova',
      logoUrl: req.file ? (req.file.filename ? `/uploads/${req.file.filename}` : req.file.path) : (req.body.logoUrl || ''),
    };

    if (!setting) {
      setting = await Setting.create({
        key: 'branding_settings',
        value: newValue,
      });
    } else {
      setting.value = newValue;
      setting.markModified('value');
      await setting.save();
    }

    res.json({ message: 'Branding settings updated successfully.', settings: setting.value });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating branding settings.' });
  }
});

// ========================
// BANNER SLIDER SETTINGS
// ========================

// GET /api/settings/banners
router.get('/banners', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'banner_settings' });
    if (!setting) {
      return res.json(DEFAULT_BANNERS);
    }
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving banner settings.' });
  }
});

// PUT /api/settings/banners (Admin only) - supports banner image uploads
router.put('/banners', verifyToken, isAdmin, verifyCsrf, upload.array('bannerImages', 10), async (req, res) => {
  try {
    let banners = [];
    if (req.body.banners) {
      banners = JSON.parse(req.body.banners);
    }

    // Map uploaded files to corresponding banner entries by index
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Files are named with fieldname like bannerImages, use originalname to get index
        const indexMatch = file.fieldname.match(/bannerImages\[(\d+)\]/);
        const idx = indexMatch ? parseInt(indexMatch[1]) : null;
        if (idx !== null && banners[idx]) {
          banners[idx].image = file.filename ? `/uploads/${file.filename}` : file.path;
        } else {
          // For array uploads, assign to banners that have newImageIndex field
          const bannerWithIdx = banners.find((b, i) => b._newFileIndex === file.originalname);
          if (bannerWithIdx) {
            bannerWithIdx.image = file.filename ? `/uploads/${file.filename}` : file.path;
          }
        }
      });
    }

    // Clean up internal markers
    banners = banners.map(b => {
      const { _newFileIndex, ...clean } = b;
      return clean;
    });

    let setting = await Setting.findOne({ key: 'banner_settings' });
    if (!setting) {
      setting = await Setting.create({
        key: 'banner_settings',
        value: banners,
      });
    } else {
      setting.value = banners;
      setting.markModified('value');
      await setting.save();
    }

    res.json({ message: 'Banner settings updated successfully.', banners: setting.value });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating banner settings.' });
  }
});

module.exports = router;
