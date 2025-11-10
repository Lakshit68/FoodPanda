const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  status: { type: String, enum: ['PLACED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'], default: 'PLACED' },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);




