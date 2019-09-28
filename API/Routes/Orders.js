const express = require('express');
//Enabling router
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../Authentication/auth');
const Cart = require('../Models/cart');
const Order = require('../Models/order');
const Product = require('../Models/product');


router.get('/', (req, res, next) => {
    Order.find()
    .select()
    .populate('order', 'name price shippingCost')
    .exec()
    .then( docs => {
        console.log("Orders Retrieved from Database", docs);
        if(docs.length >= 0){
        const totalOrders = {
            Count: docs.length,
            Orders: docs
        };
        res.status(200).json(totalOrders);
        }else{
        res.status(404).json({
            message: 'There are no orders to retrieve from database'
        });
        }
        })
    .catch(err => {
            console.log(err);
        res.status(500).json({
            error: err
    });
});   
});

router.get('/:id', (req, res, next) => {
    const orderId = req.params.id;
    if(req.session.user){
        Order.findById(orderId)
        .select()
        .populate()
        .exec()
        .then(doc => {
            console.log("Order Retrieved from Database", doc);  
            if(doc){
                res.status(200).json({
                    Order: doc 
                });
            }else{
               return res.status(404).json({
                    message: 'Provided order id is not listed in the database'
                });
            }
            }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }); 
        
    }else{
        return res.status(401).json({
            message: 'Please login to view the Order'
        })
    }
    
});

router.post('/', (req, res, next) => {
    Cart.findById(req.body.cartId)
        .then(cart => {
                if(!cart){
                    return res.status(404).json({
                        Message: 'You haven\'t  added anything to cart'
                    });
                }
                    const order = new Order({
                        _id: new mongoose.Types.ObjectId(),
                        cart: req.body.cartId,
                        user: req.session.user,
                        product: cart.productName,
                        productId: cart.product,
                        quantity: cart.quantity
                        //totalPrice: cart.quantity * productId.price 
                        });
                    order.save();
                    Cart.findByIdAndDelete(req.body.cartId).exec();
                    res.status(201).json({
                        message : 'Order has been placed',
                        createdOrder: {
                            product: order.product,
                            user: order.user,
                            productId: order.productId,
                            quantity: order.quantity
                        }
                    });
            }).catch(err => {
            console.log(req.body.cartId);
            res.status(500).json({
            Message: 'Please provide a valid cart id to place order',
            error: err
             });
        });    
    });    

module.exports = router;
