const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: Number,
  currency: String,
  paymentMethod: String,
  createdAt: Date,
  accessToken: String,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
