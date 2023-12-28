const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: String,
  quantity: Number,
  status: String,
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  shippingAddress: String,
  paymentMethod: String,
  totalMRP: String,
  totalDiscount: String,
  totalAmountPayable: String,
  status: String, 
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

