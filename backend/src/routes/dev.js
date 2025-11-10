const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const connectDB=require('../db');
const router = express.Router();

const restaurantsSample = [
  { id: 'r1', name: 'The Italian Bistro', cuisines: ['Italian','Pasta','Pizza'], rating: 4.5, time: '30-45 min', priceForOne: 25, img: 'https://images.unsplash.com/photo-1546549039-49e3d4397f2b?q=80&w=1200' },
  { id: 'r2', name: 'Burger Haven', cuisines: ['American','Burgers','Fast Food'], rating: 4.2, time: '20-30 min', priceForOne: 20, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200' },
  { id: 'r3', name: 'Sushi Delights', cuisines: ['Japanese','Sushi','Asian'], rating: 4.8, time: '40-50 min', priceForOne: 35, img: 'https://images.unsplash.com/photo-1562158075-8c3bcec3a89e?q=80&w=1200' },
  { id: 'r4', name: 'Spice Route', cuisines: ['Indian','North Indian'], rating: 4.3, time: '35-45 min', priceForOne: 22, img: 'https://images.unsplash.com/photo-1604908812838-3f082e676556?q=80&w=1200' },
  { id: 'r5', name: 'Green Bowl', cuisines: ['Healthy','Salads'], rating: 4.1, time: '20-25 min', priceForOne: 18, img: 'https://images.unsplash.com/photo-1556767576-5ec41e3239fa?q=80&w=1200' },
  { id: 'r6', name: 'Dragon Wok', cuisines: ['Chinese'], rating: 4.4, time: '25-35 min', priceForOne: 24, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200' },
  { id: 'r7', name: 'Kebab Corner', cuisines: ['Mughlai'], rating: 4.2, time: '30-40 min', priceForOne: 23, img: 'https://images.unsplash.com/photo-1617692855027-4562094a3556?q=80&w=1200' },
  { id: 'r8', name: 'Sweet Tooth', cuisines: ['Desserts'], rating: 4.6, time: '20-30 min', priceForOne: 15, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200' },
];

router.post('/seed', async (req, res, next) => {
  try {
    await connectDB();
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    for (const r of restaurantsSample) {
      const restaurant = await Restaurant.create({
        name: r.name,
        cuisine: r.cuisines,
        address: 'Sample Address',
        city: 'Sample City',
        rating: r.rating,
        ratingCount: Math.floor(Math.random() * 500) + 50,
        image: r.img,
        deliveryTimeMins: parseInt((r.time || '30').split('-')[0]),
        priceLevel: Math.round(r.priceForOne / 100) || 2,
      });

      // Create some menu items for each restaurant
      for (let i = 0; i < 5; i++) {
        await MenuItem.create({
          restaurant: restaurant._id,
          name: `Sample Dish ${i + 1}`,
          description: 'A delicious sample dish.',
          price: Math.floor(Math.random() * 300) + 100,
          isVeg: Math.random() > 0.5,
        });
      }
    }

    res.status(201).json({ message: 'Database seeded successfully' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
