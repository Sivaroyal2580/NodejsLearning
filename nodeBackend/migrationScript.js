const mongoose = require('mongoose');
const Product = require('./products');

const backendUrl = 'http://192.168.29.98:5000/api/products';
const dbName = 'jewelryStore';
const dbUrl = `mongodb://127.0.0.1:27017/${dbName}`;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    const products = await Product.find();

    for (const product of products) {
      const updatedImages = product.images.map(image => `${backendUrl}/assets/images/${image}`);
      product.images = updatedImages;
      await product.save();
      console.log(`Updated document with ID: ${product._id}`);
    }

    console.log('Migration completed successfully.');
  })
  .catch(error => console.error('Error connecting to MongoDB:', error))
  .finally(() => mongoose.disconnect());
