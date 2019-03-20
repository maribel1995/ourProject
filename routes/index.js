const express = require('express');
const router = express.Router();


//Index

router.get('/', (req,res,next) =>{
    res.render('index');
});


module.exports = router;