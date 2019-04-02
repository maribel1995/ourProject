const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const nodemailer = require('nodemailer');
const ensureLogin = require("connect-ensure-login");


let transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
      user: process.env.MAILTRAPUSER,
      pass: process.env.MAILTRAPPASSWD
    }
  });

router.get('/orders', (req, res, next) => {
    res.render('order/orders');
})


router.get('/request/:id', ensureLogin.ensureLoggedIn(), (req,res,next)=>{
    //let {productId} = req.body;
    let productId = req.params.id;
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) return res.status(404).send('not-found');
   

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }
    let date = new Date();
    let protocol = date.getYear()+(date.getMonth()+1)+date.getDay()+token.toUpperCase();
    
    Product.findOne({_id:productId}).populate('owner')
    .then( product =>{
        const newOrder = new Order({
            protocol: protocol,
            requestedProduct:productId,
            requester:req.user._id,
            bider:product.owner
        });
        console.log(newOrder);

        let emailHTMLBody = req.user.name+` is interested in your product, click here to see some products of your interest <a href="${process.env.APP_HOST}/request/${protocol}">here</a>`;

    newOrder.save()
    .then(order => {
      transporter.sendMail({
        from: '"Ichange" <noreply@ichange.com>',
        to: product.owner.email, 
        subject: 'A new person is interested in your '+product.name+' - ichange', 
        // text: message,
        html: `<b>${emailHTMLBody}</b>`
      })
      .then(info => res.redirect('/orders'))
      .catch(err => { throw new Error(err)})
    })
    .catch(err => { throw new Error(err)});
    })
    .catch(err => { throw new Error(err)});

   


    
})

module.exports = router;