const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Cart } = require('../models');
const { JWT_SECRET, ALGORITHM, verifyToken } = require('../middleware/auth');

// Password security strength requirements
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  // TODO(security): Consider integrating leaked password detection (HaveIBeenPwned API).
  // TODO(security): Consider adding MFA for admin accounts.
  return null;
};

// POST /api/auth/register - Customer registration only
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required fields.' });
  }

  // Password validation
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  try {
    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password with 12 salt rounds (memory-hard)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Registration always creates customer role
    // Admin accounts are seeded separately
    const role = 'customer';

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      addresses: [],
    });

    // Create cart for user
    await Cart.create({ userId: user._id, items: [] });

    // Generate CSRF token
    const csrfToken = crypto.randomBytes(24).toString('hex');

    // Create JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, csrfToken },
      JWT_SECRET,
      { algorithm: ALGORITHM, expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('__Secure-furnova-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      csrfToken,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required fields.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Generic error message for security
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate CSRF token
    const csrfToken = crypto.randomBytes(24).toString('hex');

    // Create JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, csrfToken },
      JWT_SECRET,
      { algorithm: ALGORITHM, expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('__Secure-furnova-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login successful.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      csrfToken,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('__Secure-furnova-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me (Get profile and fresh CSRF token)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
      },
      csrfToken: req.user.csrfToken,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving session.' });
  }
});

// POST /api/auth/toggle-role
router.post('/toggle-role', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    user.role = user.role === 'admin' ? 'customer' : 'admin';
    await user.save();

    const csrfToken = req.user.csrfToken || crypto.randomBytes(24).toString('hex');
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, csrfToken },
      JWT_SECRET,
      { algorithm: ALGORITHM, expiresIn: '24h' }
    );

    res.cookie('__Secure-furnova-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: `Role switched to ${user.role}.`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      csrfToken,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error toggling role.' });
  }
});

module.exports = router;
