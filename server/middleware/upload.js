const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const fs = require('fs');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allowed MIME types (allow-list for image uploads only)
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Check if valid Cloudinary credentials exist (fallback to local disk if default/placeholder)
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_CLOUD_NAME !== 'h4scc4sh' && 
                      process.env.CLOUDINARY_API_KEY !== '433296254433178';

let storage;
if (useCloudinary) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let format = 'jpg';
      if (file.mimetype === 'image/png') format = 'png';
      if (file.mimetype === 'image/webp') format = 'webp';

      return {
        folder: 'furnova_uploads',
        format: format,
        allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
      };
    },
  });
} else {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, uniqueSuffix + ext);
    },
  });
}

// File filter: strict allow-list validation
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Multer instance: max 5MB per file, max 10 files
const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
});

// Middleware wrapper to normalize file paths to web-relative URLs (/uploads/filename) when using disk storage
const normalizePaths = (req, res, next) => {
  if (req.file && req.file.filename) {
    req.file.path = `/uploads/${req.file.filename}`;
  }
  if (req.files && Array.isArray(req.files)) {
    req.files.forEach(file => {
      if (file.filename) {
        file.path = `/uploads/${file.filename}`;
      }
    });
  }
  next();
};

const upload = {
  single: (field) => (req, res, next) => multerUpload.single(field)(req, res, (err) => err ? next(err) : normalizePaths(req, res, next)),
  array: (field, maxCount) => (req, res, next) => multerUpload.array(field, maxCount)(req, res, (err) => err ? next(err) : normalizePaths(req, res, next)),
  fields: (fields) => (req, res, next) => multerUpload.fields(fields)(req, res, (err) => err ? next(err) : normalizePaths(req, res, next)),
};

module.exports = upload;
