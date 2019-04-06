const express = require('express');
const router = express.Router();
const Product = require('../models/product');


//Index

router.get('/', (req, res, next) => {
    Product.find().populate('owner').sort({ createdAt: -1 })
        .then(products => {
            Product.find().distinct('category')
                .then(categories => {
                    res.render('index', {
                        products, categories
                    });
                })
                .catch(err => {
                    throw new Error(err);
                });
        })
        .catch(err => {
            throw new Error(err);
        });
});

module.exports = router;
