const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Productcontrol = require('../controllers/ProductController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/products', Productcontrol.FetchProducts);

module.exports = router;