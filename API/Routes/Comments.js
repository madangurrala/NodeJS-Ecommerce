const express = require('express');
//Enabling router
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../Authentication/auth');
const Product = require('../Models/product');
const Order = require('../Models/order');
const Comment = require('../Models/comment');
const user = require('../Models/user');

router.post('/', authenticate, (req, res, next) => {

    Product.findById(req.body.productId).then( product => {
        if(req.session.user){
            console.log(req.session.user);
            Order.find({user: req.session.user}, {productId: req.body.productId}).then( doc => {
                console.log(doc);

                if(!doc){
                    return res.status(404).json({
                        message: 'You haven\'t pleaced order for the provided product Id'
                    })
                }
                const comment = new Comment({
                    _id: new mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    user: req.session.user,
                    commentDesc: req.body.commentDesc,
                    rating: req.body.rating,
                    image: req.body.image,
                });
                    comment.save();
                    console.log(comment);
                    return res.status(200).json({
                    message: 'Comment has been added'
                })
                });
            }else{
                return res.status(401).json({
                    message: 'You have not logged in to post the comment'
                })
            }
        })
    });
    
    
    
    // const test = Product.findById(req.body.productId);;
    // console.log(test);

    // Product.findById(req.body.productId)
    //     .then( product => {
    //             console.log(product);
    //             if(!product){
    //                 return res.status(404).json({
    //                     Message: 'The entered product id is not valid'
    //                 });
    //             }else{
    //                const productOrder = Order.findById(req.body.orderId);
    //                console.log(productOrder);
    //                if(productOrder){
    //                 const comment = new Comment({
    //                     _id: new mongoose.Types.ObjectId(),
    //                     product: req.body.productId,
    //                     commentDesc: req.body.commentDesc,
    //                     rating: req.body.rating,
    //                     image: req.body.image
    //                     });
    //                     comment.save();
    //                }
    //             }
    //         }).catch(err => {
    //         res.status(500).json({
    //         Message: 'Please provide a valid product id to add comment',
    //         error: err
    //          });
    //     });       

module.exports = router;
