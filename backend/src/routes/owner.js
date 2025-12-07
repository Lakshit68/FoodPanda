const express = require('express');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const { requireAuth } = require('../middleware/auth');
const connectDB = require('../db');

const router = express.Router();

// Ensure the current user is an owner
function requireOwner(req, res, next) {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner access required' });
  }
  next();
}

// GET /api/owner/restaurants - list restaurants for the logged-in owner
router.get('/restaurants', requireAuth, requireOwner, async (req, res, next) => {
  try {
    await connectDB();
    const restaurants = await Restaurant.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (e) {
    next(e);
  }
});

// POST /api/owner/restaurants - create a new restaurant for the logged-in owner
router.post('/restaurants', requireAuth, requireOwner, async (req, res, next) => {
  try {
    await connectDB();
    const payload = req.body || {};
    const doc = await Restaurant.create({
      owner: req.user._id,
      name: payload.name,
      cuisine: payload.cuisine || [],
      address: payload.address || '',
      city: payload.city || '',
      about: payload.about || '',
      contact: payload.contact || {},
      image: payload.image || '',
      deliveryTimeMins: payload.deliveryTimeMins || 30,
      priceLevel: payload.priceLevel || 2,
      openingHours: payload.openingHours || '10:00 AM - 11:00 PM',
    });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

// GET /api/owner/restaurants/:id/categories - list categories for a specific restaurant (owner-only)
router.get('/restaurants/:id/categories', requireAuth, requireOwner, async (req, res, next) => {
  try {
    await connectDB();
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const categories = await Category.find({ restaurant: restaurant._id }).sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (e) {
    next(e);
  }
});

// POST /api/owner/restaurants/:id/categories - create category for a specific restaurant (owner-only)
router.post('/restaurants/:id/categories', requireAuth, requireOwner, async (req, res, next) => {
  try {
    await connectDB();
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const payload = req.body || {};
    if (!payload.name) return res.status(400).json({ message: 'Category name is required' });
    const count = await Category.countDocuments({ restaurant: restaurant._id });
    const category = await Category.create({
      restaurant: restaurant._id,
      name: payload.name,
      image: payload.image || '',
      order: typeof payload.order === 'number' ? payload.order : count,
    });
    res.status(201).json(category);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
