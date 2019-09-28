const express = require('express');
//Enabling router
const router = express.Router();
const Product = require('../Models/product');
const authenticate = require('../Authentication/auth');
const mongoose = require('mongoose');
const multer = require('multer');


//GET ALL
router.get('/', (req, res, next) => {
    Product.find()
        .select('_id name productDesc image price shippingCost')
        .exec()
        .then( products => {
            console.log("Products Retrieved from Database", products);
            if(products.length >= 0){
            const totalProd = {
                Count: products.length,
               // Products: docs
                Products: products.map( product => {
                    return {
                        product,
                        request: {
                        type: 'GET',
                        URL: 'http://localhost:3000/products/' + product._id
                         }
                    }
                 })
            };
            res.status(200).json(totalProd);
            }else{
            res.status(404).json({
                message: 'There are no products to retrieve from database'
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

//GET ProductId
router.get('/:id', (req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId)
        .select('_id name productDesc image price shippingCost').exec()
        .then(doc => {
            console.log("Product Retrieved from Database",doc);  
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({
                    message: 'Provided product id is not listed in the database'
                });
            }
            }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }); 
});

//POST Product
router.post('/', authenticate, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        productDesc: req.body.productDesc,
        price: req.body.price,
        image: req.body.image,
        shippingCost: req.body.shippingCost
    });
    product.save().then(newProduct => {
        console.log(newProduct);
        res.status(201).json({
            message : 'Product has been added to the database',
            createdProduct: {
                name: newProduct.name,
                productDesc: newProduct.productDesc,
                price: newProduct.price,
                image: newProduct.image,
                shippingCost: newProduct.shippingCost
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

//UPdate a filed or all the fields of product
router.patch('/:id', authenticate, (req, res, next) => {
    const productId = req.params.id;
    const updateProperty = {};
    for (const property of req.body ){
        updateProperty[property.newOperation] = property.value;
        }
    Product.findById(productId)
    .exec()
    .then(doc => {
        if(doc){
            Product.update({_id: productId}, { $set: updateProperty }).exec();
            console.log(res);
            res.status(200).json({
            message: 'Product Updated Successfully'
        });
        }else{
            res.status(404).json({
                message: 'Provided product id is not listed in the database'
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

//Delete Product
router.delete('/:id', authenticate, (req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId)
    .exec()
    .then(doc => {
        if(doc){
            Product.remove({_id: productId}).exec();
            res.status(200).json({
                message: 'Provided product has been deleted'
            });
        }else{
            res.status(404).json({
                message: 'Provided product id is not listed in the database'
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

module.exports = router;
