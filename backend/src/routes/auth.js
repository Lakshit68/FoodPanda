const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
     await connectDB();
    const { fullName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, path: '/' });
    res.status(201).json({ message: 'Registered', user: { _id: user._id, fullName: user.fullName, email: user.email } });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, path: '/' });
    res.json({ message: 'Logged in', user: { _id: user._id, fullName: user.fullName, email: user.email, isPremium: user.isPremium } });
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, path: '/' });
  res.json({ message: 'Logged out' });
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ authenticated: false });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.json({ authenticated: false });
    res.json({ authenticated: true, user: { _id: user._id, fullName: user.fullName, email: user.email, isPremium: user.isPremium } });
  } catch (e) {
    res.json({ authenticated: false });
  }
});

router.put('/premium', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.isPremium = !user.isPremium;
    await user.save();
    res.json({ message: 'Premium status updated', user: { _id: user._id, fullName: user.fullName, email: user.email, isPremium: user.isPremium } });
  } catch (e) { next(e); }
});

module.exports = router;




