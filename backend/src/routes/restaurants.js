const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// GET /api/restaurants?search=&cuisine=&city=&page=1&limit=12
router.get('/', async (req, res, next) => {
  try {
    const { search = '', cuisine = '', city = '', page = 1, limit = 12 } = req.query;
    const q = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      
      const menuItems = await MenuItem.find({ name: searchRegex });
      const restaurantIds = menuItems.map(item => item.restaurant);

      q.$or = [
        { name: searchRegex },
        { _id: { $in: restaurantIds } }
      ];
    }

    if (city) q.city = { $regex: city, $options: 'i' };
    if (cuisine) q.cuisine = { $in: cuisine.split(',') };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Restaurant.find(q).sort({ rating: -1 }).skip(skip).limit(parseInt(limit)),
      Restaurant.countDocuments(q)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Restaurant.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

// GET /api/restaurants/:id/menu
router.get('/:id/menu', async (req, res, next) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.id });
    res.json(items);
  } catch (e) { next(e); }
});

// GET /api/restaurants/offers
router.get('/offers', async (req, res, next) => {
  try {
    const offers = await Restaurant.find({ offer: { $gt: 0 } }).sort({ offer: -1 }).limit(5);
    res.json(offers);
  } catch (e) { next(e); }
});

module.exports = router;




