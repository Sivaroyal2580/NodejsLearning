const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ordercontroller = require('../controllers/OrderController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/orders',ordercontroller.CreateOrder);
router.get('/orders',ordercontroller.FetchOrder)

module.exports = router;