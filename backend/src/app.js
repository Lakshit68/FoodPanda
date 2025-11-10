const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menus');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const bookingRoutes = require('./routes/bookings');
const devRoutes = require('./routes/dev');

const app = express();

const origins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({ origin: origins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'FoodTown Zomato-like API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dev', devRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;


