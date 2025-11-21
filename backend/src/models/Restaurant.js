const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: [String], default: [] },
  address: { type: String },
  city: { type: String },
  about: { type: String },
  contact: { phone: String, email: String },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  image: { type: String },
  deliveryTimeMins: { type: Number, default: 30 },
  priceLevel: { type: Number, min: 1, max: 4, default: 2 },
  openingHours: { type: String, default: '10:00 AM - 11:00 PM' },
  isOpen: { type: Boolean, default: true },
  deliveryFee: { type: Number, default: 29 },
  offer: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);





