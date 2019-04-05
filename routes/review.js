const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const User = require('../models/user');
const Product = require('../models/product');



router.get("/review", (req, res, next) => {
  res.render("order/orders");
});


router.post("/user/review",  (req, res, next) => {
    const {
      rating,
      comments,
      userId
    } = req.body;

    const newReview = new Review({
        rating,
        comments,
        user: userId,
        sender: req.user._id
      });
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) return res.status(404).send('not-found');
    newReview.save()
    .then(review =>{
        let loggedUser = req.user._id.equals(userId);
        User.findOne({ _id: userId })
        .then(user => {

            Product.find({owner:userId})
            .then( products =>{
              Review.find({$and: [{user:userId},{comments: { $ne: "" }}]}).sort({createdAt:-1}).populate('sender')
              .then(reviews =>{
            res.redirect(`/user/${userId}`);
        })
        .catch(err => { throw new Error(err)});
    })
    .catch(err => { throw new Error(err)});
    })
    .catch(err => { throw new Error(err)});
})
.catch(err => { throw new Error(err)});
});

module.exports = router;