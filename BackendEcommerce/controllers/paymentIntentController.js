const Payment = require('../models/paymentIntentmodel'); 
const bcrypt = require('bcrypt');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Route to create a customer and generate a payment intent
const createCustomerAndPaymentIntent = async (req, res) => {
  const { email, name, password, phone, amount, currency } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a customer
    const customer = await createStripeCustomer({ email, name, password, phone });
    const customerId = customer.id;

    // Create a payment intent using customer ID
    const paymentIntent = await createPaymentIntentUsingCustomerId(customerId, amount, currency);

    res.status(200).json({
      message: "Customer created and payment intent generated",
      customerId,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "An error occurred during user registration and payment intent creation" });
  }
  // Save payment data to MongoDB
const payment = new Payment({
    email ,
    name ,
    password:hashedPassword ,
    phone,
      amount, 
      currency, 
  createdAt: new Date(),
});
await payment.save();

};

async function createStripeCustomer({ name, email, phone }) {
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
      phone: phone,
    });

    return customer;
  } catch (err) {
    console.error('Error creating Stripe customer:', err);
    throw err;
  }
}

async function createPaymentIntentUsingCustomerId(customerId, amount, currency) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount,
      currency,
      payment_method_types: ['card'],
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }

}


module.exports = {
  createCustomerAndPaymentIntent,
};
