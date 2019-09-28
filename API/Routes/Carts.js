const express = require('express');
//Enabling router
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../Authentication/auth');
const Cart = require('../Models/cart');
const Product = require('../Models/product');
const User = require('../Models/user');

//GET ALL
router.get('/', (req, res, next) => {
        Cart.find()
        .select()
        .populate()
        .exec()
        .then( docs => {
            console.log("Cart Retrieved from Database", docs);
            console.log(req.session.user);
            if(docs.length >= 0){
            const totalCarts = {
                Count: docs.length,
                Carts: docs
            };
            res.status(200).json(totalCarts);
            }else{
            res.status(404).json({
                message: 'There are no carts to retrieve from database'
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

//GET cartId
router.get('/:id', (req, res, next) => {
    const cartId = req.params.id;
    if(req.session.user){
        Cart.findById(cartId)
        .select('_id product quantity')
        .populate('product')
        .exec()
        .then(doc => {
            console.log("Cart Retrieved from Database", doc);  
            if(doc){
                res.status(200).json({
                    Cart: doc 
                });
            }else{
               return res.status(404).json({
                    message: 'Provided cart id is not listed in the database'
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
            message: 'Please login to view the cart'
        })
    }
    
});

//POST Cart
router.post('/', (req, res, next) => {
    
        Product.findById(req.body.productId)
        .then( product => {
                if(!product){
                    return res.status(404).json({
                        Message: 'Entered product does not exist in the db'
                    });
                }else{
                    const cart = new Cart({
                        _id: new mongoose.Types.ObjectId(),
                        product: req.body.productId,
                        user: req.session.user,
                        productName: product.name,
                        quantity: req.body.quantity
                        });
                        return cart.save();
                }
                    
            })
        .then(newCart => {
            console.log(newCart);
            res.status(201).json({
                message : 'Cart has been added to the database',
                createdCart: {
                    product: newCart.product,
                    user: newCart.user,
                    quantity: newCart.quantity
                }
            });
        }).catch(err => {
            res.status(500).json({
            Message: 'Please provide a valid product id to add to the cart',
            error: err
             });
        });    
    });    

//Update a filed or all the fields of cart
router.patch('/:id', authenticate, (req, res, next) => {
    const cartId = req.params.id;
    const updateProperty = {};
    for (const property of req.body ){
        updateProperty[property.newOperation] = property.value;
        }
    Cart.findById(cartId)
    .exec()
    .then(doc => {
        if(doc){
            Cart.update({_id: cartId}, { $set: updateProperty }).exec();
            console.log(res);
            res.status(200).json({
            message: 'Cart Updated Successfully'
        });
        }else{
            res.status(404).json({
                message: 'Provided Cart id is not listed in the database'
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

//Delete Cart
router.delete('/:id', authenticate, (req, res, next) => {
    const cartId = req.params.id;
    Cart.findById(cartId)
    .exec()
    .then(doc => {
        if(doc){
            Cart.remove({_id: cartId}).exec();
            res.status(200).json({
                message: 'Provided cart has been deleted'
            });
        }else{
            res.status(404).json({
                message: 'Provided cart id is not listed in the database'
            });
        }  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            Message: 'Enter a valid cart id',
            Error: err
        });
    });
});

module.exports = router;
