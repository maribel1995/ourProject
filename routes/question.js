const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const Product = require('../models/product');
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");


router.get('/question', (req, res, next) => {
    console.log('get foi')
})

router.post('/question', (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    } else {
        const {productId, comment} = req.body;
        console.log(comment)
    const newQuestion = new Question({
        comment,
        user:req.user
    });
    newQuestion.save()
    .then(question => {
        Product.update({
            _id:productId
        },{
            $push: {
                questions: question._id
            }
        },{
            new:true
        })
        .then(product => {
            res.redirect(`/products/perfil/${productId}`)
        })
        .catch(error => {throw new Error(error)})
    })
    .catch(error => {throw new Error(error)});
}
});


module.exports = router;