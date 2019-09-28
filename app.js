const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/eCommerce';
const cookiesParser = require('cookie-parser');
const session = require('express-session');

//Importing product routes
const productRoutes = require('./API/Routes/Products');
const cartRoutes = require('../Node_eCommerce/API/Routes/Carts');
const userRoutes = require('./API/Routes/Users');
const orderRoutes = require('./API/Routes/Orders');
const commentRoutes = require('./API/Routes/Comments');

try{
    mongoose.connect( url, { useNewUrlParser: true });
    console.log('Connected to mongoDB');
}catch(err){
    console.log(err.stack);
   }

//Logger middleware
app.use(morgan('dev'));
//Parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookiesParser());
app.use(session({secret:"session", resave: false, saveUninitialized: true}));

//Postman doesn't need this but required when using with browsers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/Products', productRoutes);
app.use('/Carts', cartRoutes);
app.use('/Users', userRoutes);
app.use('/Orders', orderRoutes);
app.use('/Comments', commentRoutes);

app.use((req, res, next) => {

    const error = new Error('Not found');
    error.status(404);
    error.status = 404;
    next(error);   
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})
module.exports = app;