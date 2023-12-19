
const Product = require('../models/ProductsModel');


const FetchProducts = async(req,res)=>{
    try {
        const products = await Product.find().sort({ id: 1 });
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
      }
    };
    

    module.exports = { FetchProducts};
   