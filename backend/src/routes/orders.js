const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const connectDB = require('../db');

const router = express.Router();

// POST /api/orders
router.post('/', requireAuth, async (req, res, next) => {
  try {
    await connectDB();
    const { restaurant: restaurantId, items, total, address } = req.body;
    const [user, restaurant] = await Promise.all([
      User.findById(req.user._id),
      Restaurant.findById(restaurantId)
    ]);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const deliveryFee = user.isPremium ? 0 : restaurant.deliveryFee;
    const finalTotal = total + deliveryFee;

    const order = await Order.create({ 
      user: req.user._id, 
      restaurant: restaurantId, 
      items, 
      total: finalTotal, 
      deliveryFee,
      address 
    });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

// GET /api/orders/my
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    await connectDB();
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { next(e); }
});

module.exports = router;





