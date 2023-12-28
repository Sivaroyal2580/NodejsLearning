const express = require("express");
const Product = require("../models/productmodel");
const router = express.Router(); 

//swagger 

/**
 * @swagger
 * /products/api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product in the database.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               previewImage:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               rating:
 *                 type: number
 *               reviews:
 *                 type: number
 *               discount:
 *                 type: string
 *               description:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               reviewsList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     rating:
 *                       type: number
 *                     reviewText:
 *                       type: string
 *             required:
 *               - id
 *               - title
 *               - price
 *               - images
 *               - previewImage
 *               - category
 *               - tags
 *               - rating
 *               - reviews
 *               - discount
 *               - description
 *               - sizes
 *               - reviewsList
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Bad request - Invalid input.
 */




// POST endpoint to add a new product
router.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await Product.create(newProduct);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

/**
 * @swagger
 * /products/api/allproducts:
 *   get:
 *     summary: Get a list of products.
 *     description: Retrieve a list of products from the database.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successful retrieval of products.
 *       500:
 *         description: Error while fetching products.
 *         
 */

// GET endpoint to retrieve all products
router.get('/api/allproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

module.exports = router;