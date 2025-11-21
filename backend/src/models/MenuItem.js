const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, default: 'Uncategorized' },
  isSpecial: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  isVeg: { type: Boolean, default: false },
  customization: [{ name: String, options: [String] }]
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);





