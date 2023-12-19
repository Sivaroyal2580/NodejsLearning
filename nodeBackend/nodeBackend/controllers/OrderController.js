const Order = require('../models/OrderModel');

const CreateOrder = async(req,res)=>{
    try {

        const orderData = req.body;
    
        const order = new Order({
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          totalMRP: orderData.totalMRP,
          totalDiscount: orderData.totalDiscount,
          totalAmountPayable: orderData.totalAmountPayable,
          status: 'Processing',
        });
    
        await order.save();
    
        console.log('Order saved:', order);
    
        res.status(201).json(order);
        console.log('order submitted')
      } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

const FetchOrder = async(req,res)=>{
      try {
            const orders = await Order.find().sort({ createdAt: -1 }).lean();
        
            const orderItems = orders.map(order => order.items);
        
            res.json(orderItems);
            console.log('Retrieved', orderItems)
          } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve orders' });
          }
        };
    

    module.exports = {CreateOrder ,FetchOrder};
    
