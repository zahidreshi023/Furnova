const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Secure multi-tiered fallback to load the JWT secret key
function getSecret() {
  if (process.env.JWT_SECRET_KEY) {
    return process.env.JWT_SECRET_KEY;
  }
  const secretPath = path.join(__dirname, '..', 'jwt_secret.txt');
  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, 'utf-8').trim();
  }
  console.warn("Generating ephemeral secret. Instance-isolated!");
  const ephemeralSecret = crypto.randomBytes(32).toString('hex');
  try {
    fs.writeFileSync(secretPath, ephemeralSecret, { mode: 0o600 });
  } catch (err) {
    console.error("Failed to persist ephemeral secret to disk:", err.message);
  }
  return ephemeralSecret;
}

const JWT_SECRET = getSecret();
const ALGORITHM = 'HS256';

// Middleware to verify JWT token in HttpOnly cookies
const verifyToken = (req, res, next) => {
  const token = req.cookies['__Secure-furnova-token'];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No session token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET, { algorithms: [ALGORITHM] });
    req.user = verified; // { id, email, role, csrfToken }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

// Middleware to enforce admin authorization
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Requires administrator permissions.' });
  }
  next();
};

// Middleware to enforce CSRF token checks on state-changing requests
const verifyCsrf = (req, res, next) => {
  // Safe methods do not require CSRF checks
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const clientCsrfToken = req.headers['x-csrf-token'];
  const sessionCsrfToken = req.user ? req.user.csrfToken : null;

  if (!clientCsrfToken || !sessionCsrfToken || clientCsrfToken !== sessionCsrfToken) {
    return res.status(403).json({ error: 'CSRF validation failed. Request blocked.' });
  }

  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  verifyCsrf,
  JWT_SECRET,
  ALGORITHM,
};
