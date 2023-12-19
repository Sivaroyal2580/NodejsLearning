const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: String,
  images: [String],
  previewImage: String,
  category: String,
  tags: [String],
  rating: Number,
  reviews: Number,
  discount: String,
  description: String,
  sizes: [String],
  reviewsList: [
    {
      username: String,
      rating: Number,
      reviewText: String,
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);