const express = require('express');
const app =express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;

const dbconnection = require('./config/db');
app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productroute = require('./routes/ProductRoute');
const orderroute = require('./routes/OrderRoute');
const wishlistroute = require('./routes/WishlistRoute');

app.use('/api',productroute);
app.use('/api',orderroute);
app.use('/api',wishlistroute);



app.listen(port,function(){
    console.log('server running on : 5000');
});