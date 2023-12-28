const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    email : String,
     name : String,
      password : String,
       phone: String,
        amount: Number, 
        currency:String,
       createdAt: Date,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
