const express = require('express');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { requireAuth } = require('../middleware/auth');
const connectDB=require('../db');
const router = express.Router();

// POST /api/menus (create menu item) — demo only
router.post('/', requireAuth, async (req, res, next) => {
  try {
    await connectDB();
    const { restaurant, name, description, price, image, tags, isVeg } = req.body;
    const rest = await Restaurant.findById(restaurant);
    if (!rest) return res.status(400).json({ message: 'Invalid restaurant' });
    const item = await MenuItem.create({ restaurant, name, description, price, image, tags, isVeg });
    res.status(201).json(item);
  } catch (e) { next(e); }
});

module.exports = router;




