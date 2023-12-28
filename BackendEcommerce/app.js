//app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = 5000;
const { authenticateToken } = require('./middleware/authmiddleware');

// MongoDB connection
const dbconnection = require('./config/dbconnection')

// Middlewares
app.use(cors());
app.use(express.json());

// Import and use routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/userroute");
const productRoute = require("./routes/productroute");
const cartRoute = require("./routes/cartroute");
const orderRoute = require("./routes/orderroute");

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/carts", cartRoute);
app.use("/orders", orderRoute);

//swagger

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Node.js API for a Ecommerce",
      version: "3.0.0",
      description: "A simple CRUD API application for a product using Express and MongoDB.",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/productroute.js", "./routes/auth.js", "./routes/orderroute.js","./routes/userroute.js" ,"./routes/cartroute.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// stripe checkout session
const path = require("path");
const stripe = require("stripe")("put your stripe secret key");

const YOUR_DOMAIN = "http://localhost:8080";

// static files
app.use(express.static(path.join(__dirname, "views")));

// middleware
app.use(express.json());

// routes
app.post("/payment", async (req, res) => {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: product.amount * 100,
                },
                quantity: product.quantity,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      });        

    res.json({ id: session.id });
});

//paymentIntent Routes
const paymentRoutes = require('./routes/paymentIntentroute');
app.use('/api', paymentRoutes);


app.listen(port, () => {
  console.log("Backend server is running on port 5000!");
});


