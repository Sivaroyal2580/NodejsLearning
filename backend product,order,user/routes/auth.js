const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel'); // Import your User model

// Your secret key for JWT
const SECRET_KEY = 'bjsdhbjdmb5878jhmnd';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user by providing user details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - Invalid user data.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Registration failed.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 */

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'User already registered. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document with username and password
    const user = new User({
      username,
      password: hashedPassword,
    });

    // Sign a JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: '2h',
    });

    // Store the access token in the user document
    user.authToken = token;

    // Save the user document with the access token
    await user.save();

    res.status(201).json({ message: 'User registered successfully', token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user.
 *     description: Authenticate a user by their username and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful authentication.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 authToken:
 *                   type: string
 *                 userId:
 *                   type: string
 *       401:
 *         description: Authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Login failed.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 */

//login 
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // If the username and password are correct, return the stored authtoken and user ID from the database
    const foundUser = await User.findById(user._id).select('authToken');
    res.status(200).json({ authToken: foundUser.authToken, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});


module.exports = router;
