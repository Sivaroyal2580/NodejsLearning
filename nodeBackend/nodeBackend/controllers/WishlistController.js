const Wishlist = require('../models/WishlistModel');

const Addwishlist = async(req,res)=>{
    try {
      const productId = req.body.productId;
       let wishlist = await Wishlist.findOne();
    
        // If the wishlist is null (empty), create a new wishlist document
        if (!wishlist) {
          wishlist = new Wishlist({ products: [] });
        }
    
        // Check if the product is already in the wishlist
        if (wishlist.products.includes(productId)) {
          console.log('Product is already in the wishlist', productId);
          return res.json({ message: 'Product is already in your wishlist' });
        }
    
        // Add the product to the wishlist and save it
        wishlist.products.push(productId);
        console.log('ProductId is:',productId)
        await wishlist.save();
    
        console.log('Updated Wishlist:', wishlist);
        return res.json({ message: 'Product added to wishlist' });
      } catch (error) {
        console.error('Error adding to Wishlist:', error);
        return res.status(500).json({ error: 'Failed to add to wishlist' });
      }
    };


    const fetchWishlistItems = async(req,res)=>{
        try {
            const wishlist = await Wishlist.findOne();
            const wishlistItems = await Product.find({ _id: { $in: wishlist.products } });
            res.json(wishlistItems);
            console.log('Wislist Items Retrieved:',wishlistItems)
          } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve wishlist items' });
          }
        };


  const removeWishlistProduct = async(req,res)=>{
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne();
    
        // If the wishlist is null (empty), there's nothing to remove.
        if (!wishlist) {
          console.log('Wishlist is empty.');
          return res.json({ message: 'Wishlist is empty.' });
        }
    
        // Check if the product is in the wishlist.
        const index = wishlist.products.indexOf(productId);
    
        if (index === -1) {
          console.log('Product is not in the wishlist.');
          return res.json({ message: 'Product is not in your wishlist.' });
        }
    
        // Remove the product from the wishlist and save it.
        wishlist.products.splice(index, 1);
        await wishlist.save();
    
        console.log('Updated Wishlist:', wishlist);
        return res.json({ message: 'Product removed from wishlist' });
      } catch (error) {
        console.error('Error removing from Wishlist:', error);
        return res.status(500).json({ error: 'Failed to remove from wishlist' });
      }
    };
    
   module.exports = { Addwishlist , fetchWishlistItems, removeWishlistProduct}