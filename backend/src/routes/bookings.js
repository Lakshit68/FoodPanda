const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const connectDB=require('../db');
const router = express.Router();

// POST /api/bookings
router.post('/', requireAuth, async (req, res, next) => {
  try {
    await connectDB();
    const { restaurant, date, time, guests } = req.body;
    const booking = await Booking.create({ user: req.user._id, restaurant, date, time, guests });
    res.status(201).json(booking);
  } catch (e) { next(e); }
});

// GET /api/bookings/my
router.get('/my', requireAuth, async (req, res, next) => {
  try {
    await connectDB();
    const bookings = await Booking.find({ user: req.user._id }).populate('restaurant', 'name image').sort({ date: -1 });
    res.json(bookings);
  } catch (e) { next(e); }
});

module.exports = router;
