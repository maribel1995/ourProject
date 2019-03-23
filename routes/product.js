const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const uploadCloud = require('../config/cloudinary.js');



router.get('/products', (req, res, next) => {
    Product.find()
        .then(products => {

            res.render('product/products', {
                products
            });
        })
        .catch(err => {
            throw new Error(err);
        })
});

router.get('/products/add', (req, res, next) => {
    res.render('product/add');
});

router.post('/products/add', uploadCloud.array('photo'), (req, res, next) => {
    const files = req.files;
    const images = new Array();
    const {
        name,
        description,
        //owner,
        category,
        stared,
    } = req.body;

    files.forEach(file => {
        images.push(file.url);
    });

    const newProduct = new Product({
        name,
        description,
        //owner,
        category,
        stared,
        images
    });
    newProduct.save()
        .then((product) => {
            res.redirect('/products');
        }).catch((err) => {
            throw new Error(err);
        });
});

router.get('/products/edit/:id', (req, res, next) => {
    Product.findOne({
            _id: req.params.id
        })
        .then(product => {

            res.render('product/edit', {
                product
            })
        })
});

router.post('/products/uploadImages', uploadCloud.array('photo'), (req, res, next) => {
    const productId = req.body.productId;
    const files = req.files;
    const images = new Array();

    files.forEach(file => {
        images.push(file.url);
    });
    Product.update({
        _id: productId
    }, {
        $set: {
            images
        }
    }, {
        new: true
    })
    .then(product =>{
        res.redirect(`/products/edit/${productId}`)
    })
    .catch(err => {throw new Error(err)})
})


module.exports = router;