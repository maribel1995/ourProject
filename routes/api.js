const express = require('express');
const router = express.Router();
const http = require("http");
const Product = require('../models/product');




router.get('/api/products', (req,res)=>{

    Product.find()
    .then(products =>{
        res.write(JSON.stringify(products));
        res.end();

    })
    .catch(err => {throw new Error(err)})
   
})


router.get('/api/product/:id', (req,res)=>{

    let id = req.params.id;

    Product.findOne({_id:id})
    .then(product =>{

        if(!product) res.status(404).send("The product with the given id was not found!")
        res.write(JSON.stringify(products));
        res.end();

    })
    .catch(err => {throw new Error(err)})
   
})

module.exports = router;