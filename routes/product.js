const express = require('express');
const router = express.Router();


router.get('/products', (req, res, next) => {
    res.render('product/products');
})


module.exports = router;