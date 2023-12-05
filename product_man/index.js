const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const Product = require('./model/productmodel'); // Import the Product model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./model/user');

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection
const mongoURL = 'mongodb://127.0.0.1:27017/Products';
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Secret key for JWT
const SECRET_KEY = 'jyfxf709yughd4wecm7'; // Replace with your actual secret key

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new User model instance with the username and hashed password
    const user = new User({
      username,
      password: hashedPassword
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate a JWT token with the user's ID as the payload
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: '2h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected route that requires a valid token
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed' });
});

// Middleware to verify JWT token

function verifyToken(req, res, next) {
  const token = req.header('Authorization'); // Use 'Authorization' header

  if (!token) {
    console.log('Token is missing');
    return res.status(401).json({ error: 'Authentication failed: Token is missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Authentication failed: Token has expired' });
      }

      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    console.log('Token verified successfully');
    req.userId = decoded.userId;
    next();
  });
}

// POST endpoint to add a new product
app.post('/api/products', verifyToken, async (req, res) => {
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
app.get('/api/allproducts', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
