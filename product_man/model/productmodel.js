
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: String,
    images: [String],
    previewImage: String,
    category: String,
    tags: [String], // Add tags field as an array of strings
    rating: Number,
    reviews: Number,
    discount: String,
    description: String,
    sizes: [String], // Add sizes field as an array of strings
    reviewsList: [
      {
        username: String,
        rating: Number,
        reviewText: String,
      },
    ],
  });
  
  // Create a model from the schema
  const Product = mongoose.model('Product', productSchema);
  module.exports = Product;