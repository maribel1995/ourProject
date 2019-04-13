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


router.get('/orders', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  let loggedUser = req.user._id.equals(req.user._id);
  let sent, received = [];
  Order.find({ $or: [{ requester: req.user._id }, { bider: req.user._id }] }).populate('requester').populate('bider').populate('requestedProduct').populate('biderProduct').sort({updatedAt:-1})
    .then(orders => {
      sent = orders.filter(item => item.requester._id.equals(req.user._id));
     received = orders.filter(item => item.bider._id.equals(req.user._id));
      
      

      res.render('order/orders', { sent, received, orders, loggedUser });
    })
    .catch(err => { throw new Error(err) })

})


router.get('/order/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let orderId = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(orderId)) return res.status(404).send('not-found');
  Order.findOne({ _id: orderId }).populate('requester').populate('bider').populate('requestedProduct').populate('biderProduct')
    .then(order => {
      res.render('order/order', { order });
    })
    .catch(err => { throw new Error(err) })

});



router.post('/request', ensureLogin.ensureLoggedIn(), (req, res, next) => {

  let { productId, chosenProduct } = req.body;
  if (!/^[0-9a-fA-F]{24}$/.test(productId)) return res.status(404).send('not-found');
  console.log("Até aqui tudo bem " + chosenProduct);

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  let date = new Date();
  let protocol = date.getYear() + (date.getMonth() + 1) + date.getDay() + token.toUpperCase();
  Order.findOne({
    $or: [
      { $and: [{ requestedProduct: productId }, { biderProduct: chosenProduct }] },
      { $and: [{ requestedProduct: chosenProduct }, { biderProduct: productId }] }
    ]
  }).populate('requester').populate('bider').populate('requestedProduct').populate('biderProduct').sort({updatedAt:-1})
    .then(orderCheck => {
      if (orderCheck === null) {
        console.log('Isto é executado ' + orderCheck + ' requested product' + productId + ' chosen' + chosenProduct);
        Product.findOne({ _id: productId }).populate('owner')
          .then(product => {
            const newOrder = new Order({
              protocol: protocol,
              requestedProduct: productId,
              biderProduct: chosenProduct,
              requester: req.user._id,
              requesterStatus: 'Confirmed',
              bider: product.owner
            });
            // console.log(newOrder);

            let emailHTMLBody = req.user.name + ` is interested in your ${product.name} click here to see the details of your bid <a href='${process.env.APP_HOST}/order/${newOrder._id}'>here</a>`;

            newOrder.save()
              .then(order => {
                transporter.sendMail({
                  from: '"iChange" <noreply@ichange.com>',
                  to: product.owner.email,
                  subject: 'A new person is interested in your ' + product.name + ' - ichange',
                  // text: message,
                  html: `<b>${emailHTMLBody}</b>`
                })
                  .then(info => res.redirect('/orders'))
                  .catch(err => { throw new Error(err) })
              })
              .catch(err => { throw new Error(err) });
          })
          .catch(err => { throw new Error(err) });
      } else {
        console.log("Order Check " + orderCheck);

        if (orderCheck.requestedProduct._id.equals(productId) && orderCheck.biderProduct._id.equals(chosenProduct)) {
          res.redirect(`/order/${orderCheck._id}`);
          return;
        }

        Order.findOneAndUpdate(
          { _id: orderCheck._id },
          { $set: { biderStatus: 'Confirmed' } },
          { new: true }
        )
          .then(orderUpdate => {

            let emailHTMLBody = req.user.name + ` has just accepted your ${orderCheck.biderProduct.name} in exchange of ${orderCheck.requestedProduct.name}. See all details at <a href="${process.env.APP_HOST}/order/${orderCheck._id}">here</a>`;
            transporter.sendMail({
              from: '"Ichange" <noreply@ichange.com>',
              to: orderCheck.requester.email,
              subject: 'Your Product is a Match! - ichange',
              // text: message,
              html: `<b>${emailHTMLBody}</b>`
            })
              .then(info => res.redirect(`/order/${orderCheck._id}`))
              .catch(err => { throw new Error(err) })

          })
          .catch(err => { throw new Error(err) });
        // res.redirect(`/orders`);  

      }
    })
    .catch(err => { throw new Error(err) })




});

router.get("/request/accept/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let orderId = req.params.id;
  let updateData = {
    biderStatus : "Confirmed",
    status: "Match"
  }

  if (!/^[0-9a-fA-F]{24}$/.test(orderId)) return res.status(404).send('not-found');
  Order.findOneAndUpdate({ _id: orderId },{$set: updateData} ,{ new: true })
    .then(order => {

      res.redirect(`/order/${orderId}`);
    })
    .catch(error => {
      throw new Error(error);

    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/request/decline/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let orderId = req.params.id;
  let updateData = {
    biderStatus : "Declined",
    status: "Declined"
  }

  if (!/^[0-9a-fA-F]{24}$/.test(orderId)) return res.status(404).send('not-found');
  Order.findOneAndUpdate({ _id: orderId },{$set: updateData} ,{ new: true })
    .then(order => {

      res.redirect(`/order/${orderId}`);
    })
    .catch(error => {
      throw new Error(error);

    })
    .catch(error => {
      throw new Error(error);
    });
});

router.get("/request/delete/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let orderId = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(orderId)) return res.status(404).send('not-found');
  Order.deleteOne({ _id: orderId })
    .then(order => {

      res.redirect("/orders");
    })
    .catch(error => {
      throw new Error(error);

    })
    .catch(error => {
      throw new Error(error);
    });
});


module.exports = router;