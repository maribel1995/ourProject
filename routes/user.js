const express = require('express');
const router = express.Router();


router.get('/show', (req, res, next) => {
    res.render('user/show');
})


module.exports = router;