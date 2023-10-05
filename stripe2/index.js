
const express = require('express');
const stripe = require('stripe')('sk_test_51NvHLVSAo8mos9lRv30UWIVrVTZi7JGt0KMVVqYGSRdTm8CBAltwprfOwUA1Ivehf9pe8DzeZ1ZgSp4aM1s4FaP000paBcqIqe');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Create Express app
const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/stripe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db is not connected'));
db.once('open', () => {
  console.log('mongodb connected');
});

// Define a MongoDB model for payment data
const Payment = mongoose.model('Payment', {
  amount: Number,
  currency: String,
  paymentMethod: String,
  createdAt: Date,
  SuccessToken: String, // Add this field to store the success token
});


// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to render the payment form
app.get('/payment', (req, res) => {
  res.render('home', { key: 'pk_test_51NvHLVSAo8mos9lRWSaTtfNH4vmZ6ZhpZ9e7MJyZz7U80pM1cpPOPH6dv1yca6d2t6TNSn3xp5tKbI09zUtjYd2Y00TgGK7veJ' });
});

// Route to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, paymentMethod } = req.body;

  try {
    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethod],
    });

    // Save payment data to MongoDB
    const payment = new Payment({
      amount,
      currency,
      paymentMethod,
      createdAt: new Date(),
      
    });
    await payment.save();

    // Generate access token
    const accessToken = jwt.sign(
      { paymentIntentId: paymentIntent.id }, // Payload data (you can customize this)
      'sk_test_51NvHLVSAo8mos9lRv30UWIVrVTZi7JGt0KMVVqYGSRdTm8CBAltwprfOwUA1Ivehf9pe8DzeZ1ZgSp4aM1s4FaP000paBcqIqe', // Replace with your actual secret key
      { expiresIn: '1h' } // Token expiration time
    );
    res.json({ clientSecret: paymentIntent.client_secret, accessToken });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({ error: error.message });
    return;
  }
});
//payment confirmation
const SECRET_KEY = 'baVfjaVMd7wq83qi32hlesdagcdjbj;z08xz6taighwqeh'; // Replace with your actual secret key

app.post('/confirm-payment', (req, res) => {
  const { accessToken } = req.body;

  try {
    const decodedToken = jwt.verify(accessToken, 'sk_test_51NvHLVSAo8mos9lRv30UWIVrVTZi7JGt0KMVVqYGSRdTm8CBAltwprfOwUA1Ivehf9pe8DzeZ1ZgSp4aM1s4FaP000paBcqIqe');

    if (decodedToken.paymentIntentId) {
      // Generate a success token using the defined SECRET_KEY
      const successToken = jwt.sign({ paymentIntentId: decodedToken.paymentIntentId }, SECRET_KEY, { expiresIn: '1h' });

      // Respond with success and the generated token
      res.json({ success: true, message: 'Payment confirmed successfully', Successtoken: successToken });
    } else {
      res.status(400).json({ success: false, error: 'Invalid access token' });
    }
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    res.status(500).json({ success: false, error: 'Failed to confirm payment' });
  }
});


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
