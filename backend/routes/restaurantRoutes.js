const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant'); // Replace with your actual model
const Menu = require('../models/Menu'); // Replace with your actual model

router.get('/restaurants/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id); // Replace with your DB query
        const menu = await Menu.find({ restaurantId: id }); // Replace with your DB query
        res.json({ restaurant, menu });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurant details' });
    }
});

module.exports = router;