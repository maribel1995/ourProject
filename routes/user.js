const express = require('express');
const router = express.Router();


router.get('/users', (req, res, next) => {
    res.render('user/users');
})


module.exports = router;