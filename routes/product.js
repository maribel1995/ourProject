const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/products', (req, res, next) => {
    res.render('product/products');
});

router.get('/products/add', (req, res, next) => {
    res.render('product/add');
});

router.post('/products/add', (req, res, next) =>{
    const {
        name,
        description,
        //owner,
        category,
        stared,
        //images,
    } = req.body;
    
    const newProduct = new Product({
        name,
        description,
        //owner,
        category,
        stared,
    });
    newProduct.save()
    .then((product) => {
        res.redirect('/products');
    }).catch((err) => {
        throw new Error(err);
    });
});

router.get('/products/edit/:id', (req, res, next) => {
    res.render('product/edit')
});


module.exports = router;