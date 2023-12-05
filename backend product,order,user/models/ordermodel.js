const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }], // Reference to Product model
  quantities: [{ type: Number, required: true }],
  paymentMethod: { type: String, required: true },
  status: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },  
});

module.exports = mongoose.model('Order', orderSchema);