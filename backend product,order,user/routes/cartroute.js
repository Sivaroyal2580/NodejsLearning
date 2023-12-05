const express = require("express");
const Cart = require("../models/cartmodel");
const router = express.Router();


// CREATE
/**
 * @swagger
 * /carts/api:
 *   post:
 *     summary: Create a new cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       description: Cart object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Successfully created cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Internal Server Error
 */
router.post("/api", async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER CART
/**
 * @swagger
 * /carts/{userId}:
 *   get:
 *     summary: Get user's cart by userId
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user's cart to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             example:
 *               message: Cart not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;