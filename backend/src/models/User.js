const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);




