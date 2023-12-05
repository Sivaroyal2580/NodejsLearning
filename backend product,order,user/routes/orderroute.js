const express = require("express");
const Order = require("../models/ordermodel");
const router = express.Router();
const User = require("../models/usermodel");

/**
 * @swagger
 * /orders/api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order and assign it to a user.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               quantities:
 *                 type: array
 *                 items:
 *                   type: integer
 *               paymentMethod:
 *                 type: string
 *               status:
 *                 type: string
 *               orderDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created order
 *       500:
 *         description: Failed to create the order
 */



router.post('/api/orders', async (req, res) => {
  try {
    // Create a new order using the request body and assign the user's ID
    const newOrder = new Order({
      userId: req.body.userId, 
      productIds: req.body.productIds,
      quantities: req.body.quantities,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status, 
      orderDate: req.body.orderDate 
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with the created order
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Get orders for a specific user.
 *     description: Retrieve a list of orders from the database using the user's userId.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of the user for whom to retrieve orders.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of orders.
 *       404:
 *         description: No orders found for the specified user.
 *       500:
 *         description: Error while fetching orders.
 */

// GET orders for a specific user by userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the userId parameter is provided
    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId parameter' });
    }

    // Find orders for the specified user
    const orders = await Order.find({ userId });

    // Check if orders were found
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the specified user' });
    }

    // Respond with the orders
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user orders' });
  }
});

module.exports = router;