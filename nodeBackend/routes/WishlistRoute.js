const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Wishlistcontrol = require('../controllers/WishlistController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/wishlist/add',Wishlistcontrol.Addwishlist);
router.get('/wishlist/items',Wishlistcontrol.fetchWishlistItems);
router.post('/wishlist/remove',Wishlistcontrol.removeWishlistProduct);

module.exports = router ;
