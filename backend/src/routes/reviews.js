const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// POST /api/reviews
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { restaurant, rating, comment } = req.body;
    const review = await Review.create({ user: req.user._id, restaurant, rating, comment });
    // update restaurant aggregate rating (simple running average)
    const rest = await Restaurant.findById(restaurant);
    if (rest) {
      const total = rest.rating * rest.ratingCount + rating;
      rest.ratingCount += 1;
      rest.rating = total / rest.ratingCount;
      await rest.save();
    }
    res.status(201).json(review);
  } catch (e) { next(e); }
});

// GET /api/reviews/:restaurantId
router.get('/:restaurantId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'fullName');
    res.json(reviews);
  } catch (e) { next(e); }
});

module.exports = router;




