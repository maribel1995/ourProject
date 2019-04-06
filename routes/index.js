const express = require('express');
const router = express.Router();
const Product = require('../models/product');


//Index

router.get('/', (req, res, next) => {
    let filter = (req.user) ? { owner: { $ne: req.user._id } } : {};

    Product.find(filter).populate('owner').sort({ createdAt: -1 })
        .then(products => {
            Product.find(filter).distinct('category')
                .then(categories => {
                    categories.sort();

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
