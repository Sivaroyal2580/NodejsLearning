const express = require('express');
const paymentController = require('../controllers/paymentIntentController'); 

const router = express.Router();


router.post('/createCustomer_paymentIntent', paymentController.createCustomerAndPaymentIntent);

module.exports = router;