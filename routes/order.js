const express = require('express');
const router = express.Router();


router.get('/orders', (req, res, next) => {
    res.render('order/orders');
})


module.exports = router;