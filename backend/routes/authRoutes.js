const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isDbConnected } = require('../db');
const { mockUsers } = require('../mockStore');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

// Helper to remove password from user object
const sanitizeUser = (user) => {
  const obj = typeof user.toSafeObject === 'function' ? user.toSafeObject() : { ...user };
  delete obj.password;
  return obj;
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role, roleTitle, region, farmSizeAcre, primaryCropInterest } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
      }

      const newUser = new User({
        name: name.trim(),
        email: cleanEmail,
        phone: (phone || '+91 98765 00000').trim(),
        password,
        role: role || 'FARM_OWNER',
        roleTitle: roleTitle || (role === 'CUSTOMER' ? 'Direct Agro Consumer' : role === 'DEALER' ? 'Inputs Dealer' : 'Verified Cultivator'),
        region: region || 'Ranchi, Jharkhand',
        farmSizeAcre: Number(farmSizeAcre) || 5.0,
        primaryCropInterest: primaryCropInterest || 'Fresh Vegetables & Crops'
      });

      await newUser.save();
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: newUser.toSafeObject()
      });
    } else {
      // In-memory fallback
      const existing = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        phone: (phone || '+91 98765 00000').trim(),
        password,
        role: role || 'FARM_OWNER',
        roleTitle: roleTitle || 'Verified Cultivator',
        region: region || 'Ranchi, Jharkhand',
        farmSizeAcre: Number(farmSizeAcre) || 5.0,
        primaryCropInterest: primaryCropInterest || 'Fresh Vegetables & Crops',
        avatarBg: 'bg-emerald-700',
        createdAt: new Date().toISOString().split('T')[0]
      };

      mockUsers.unshift(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: sanitizeUser(newUser)
      });
    }
  } catch (err) {
    console.error('[Auth Signup Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your registered email or mobile number.'
      });
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanDigits = cleanInput.replace(/\D/g, '');

    let user = null;

    if (isDbConnected()) {
      user = await User.findOne({
        $or: [
          { email: cleanInput },
          ...(cleanDigits.length >= 6 ? [{ phone: { $regex: cleanDigits } }] : [])
        ]
      });

      if (!user) {
        return res.status(404).json({ success: false, error: 'No account found matching this email or phone.' });
      }

      if (password) {
        const isMatch = await user.comparePassword(password);
        if (!isMatch && password !== 'Password@123') {
          return res.status(401).json({ success: false, error: 'Incorrect password. Universal demo password: Password@123' });
        }
      }

      user.lastLoginAt = new Date().toLocaleString();
      await user.save();

      const token = generateToken(user);
      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: user.toSafeObject()
      });
    } else {
      // In-memory fallback
      user = mockUsers.find(u => {
        if (u.email.toLowerCase() === cleanInput) return true;
        if (cleanDigits.length >= 6) {
          const uDigits = u.phone.replace(/\D/g, '');
          return uDigits.endsWith(cleanDigits) || uDigits === cleanDigits;
        }
        return false;
      });

      if (!user) {
        return res.status(404).json({ success: false, error: 'No account found matching this email or phone.' });
      }

      if (password && user.password && user.password !== password && password !== 'Password@123') {
        return res.status(401).json({ success: false, error: 'Incorrect password. Universal demo password: Password@123' });
      }

      user.lastLoginAt = new Date().toLocaleString();
      const token = generateToken(user);

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: sanitizeUser(user)
      });
    }
  } catch (err) {
    console.error('[Auth Login Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error during login.' });
  }
});

// GET /api/auth/me (Protected)
router.get('/me', jwtAuthMiddleware, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const isObjectId = mongoose.Types.ObjectId.isValid(req.user.id);
    const query = isObjectId
      ? { $or: [{ id: req.user.id }, { _id: req.user.id }, { email: req.user.email }] }
      : { $or: [{ id: req.user.id }, { email: req.user.email }] };

    if (isDbConnected()) {
      const user = await User.findOne(query);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      return res.json({ success: true, user: user.toSafeObject() });
    } else {
      const user = mockUsers.find(u => u.id === req.user.id || u.email === req.user.email);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      return res.json({ success: true, user: sanitizeUser(user) });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/profiles (List profiles for multi-profile switching)
router.get('/profiles', async (req, res) => {
  try {
    if (isDbConnected()) {
      let users = await User.find({}).sort({ createdAt: -1 });
      if (users.length === 0) {
        await User.insertMany(mockUsers);
        users = await User.find({}).sort({ createdAt: -1 });
      }
      return res.json({
        success: true,
        count: users.length,
        profiles: users.map(u => u.toSafeObject())
      });
    } else {
      return res.json({
        success: true,
        count: mockUsers.length,
        profiles: mockUsers.map(sanitizeUser)
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { emailOrPhone, newPassword } = req.body;

    if (!emailOrPhone || !newPassword) {
      return res.status(400).json({ success: false, error: 'Identifier and new password are required.' });
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();

    if (isDbConnected()) {
      const user = await User.findOne({
        $or: [{ email: cleanInput }, { phone: cleanInput }]
      });

      if (!user) return res.status(404).json({ success: false, error: 'No account found with this email or phone.' });

      user.password = newPassword;
      await user.save();
      const token = generateToken(user);
      return res.json({ success: true, message: 'Password reset successfully', token, user: user.toSafeObject() });
    } else {
      const user = mockUsers.find(u => u.email.toLowerCase() === cleanInput || u.phone.includes(cleanInput));
      if (!user) return res.status(404).json({ success: false, error: 'No account found with this email or phone.' });

      user.password = newPassword;
      const token = generateToken(user);
      return res.json({ success: true, message: 'Password reset successfully', token, user: sanitizeUser(user) });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/seed
router.post('/seed', async (req, res) => {
  try {
    if (isDbConnected()) {
      for (const seedUser of mockUsers) {
        const exists = await User.findOne({ email: seedUser.email });
        if (!exists) {
          const u = new User(seedUser);
          await u.save();
        }
      }
      const count = await User.countDocuments();
      return res.json({ success: true, message: `Seeded ${count} user accounts to MongoDB` });
    } else {
      return res.json({ success: true, message: `In-memory mode ready with ${mockUsers.length} profiles` });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
