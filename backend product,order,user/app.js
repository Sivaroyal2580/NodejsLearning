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


app.listen(port, () => {
  console.log("Backend server is running on port 5000!");
});
