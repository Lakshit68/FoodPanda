const connectDB = require('../db');

const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = dbMiddleware;
