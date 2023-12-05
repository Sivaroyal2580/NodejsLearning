const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const productSchema = require('./model/productmodel');


// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
const mongoURL = 'mongodb://127.0.0.1:27017/Products';
mongoose.connect(mongoURL, {
     useNewUrlParser: true, 
     useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// POST endpoint to add a new product

app.post('/api/products', async (req, res) => {
    try {
      const newProduct = req.body;
      const product = await Product.create(newProduct);
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });
  
// GET endpoint to retrieve all products
app.get('/api/allproducts', async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  });
  
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//////////// GET endpoint to retrieve products by category and title
app.get('/api/requestproducts', async (req, res) => {
  const category = req.query.category;
  const title = req.query.title;

  if (!category || !title) {
    res.status(400).json({ message: 'Both category and title are required query parameters.' });
    return;
  }

  try {
    // Use Mongoose to find the product that matches both category and title
    const product = await Product.findOne({ category, title });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


