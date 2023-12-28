const express = require("express");
const Order = require("../models/ordermodel");
const User = require("../models/usermodel");
const Product = require("../models/productmodel");
const router = express.Router();

/**
 * @swagger
 * /users/{orderId}:
 *   get:
 *     summary: Get order details for specific orderId.
 *     description: Retrieve a list of user and product from the database using the user's orderId.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: The ID of the order for whom to retrieve orders.
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

// GET order details by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Check if the orderId parameter is provided
    if (!orderId) {
      return res.status(400).json({ error: 'Invalid orderId parameter' });
    }

    // Find the order with the specified orderId
    const order = await Order.findById(orderId);

    // Check if the order was found
    if (!order) {
      return res.status(404).json({ message: 'No order found for the specified orderId' });
    }

    // Respond with the order details
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve order details' });
  }
}); 

/**
 * @swagger
 * /users/api/users:
 *   get:
 *     summary: Get all users.
 *     description: Retrieve a list of users from the database .
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful retrieval of orders.
 *       404:
 *         description: No orders found for the specified user.
 *       500:
 *         description: Error while fetching orders.
 */

//get all users
router.get("/api/users",async(req,res)=>{
  try{
  const users = await User.find();
  res.status(200).json(users);
}catch(error){
  res.status(400).json({ error:"couldn't fetch all users"});
};
});

module.exports = router;
