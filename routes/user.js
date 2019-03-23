const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const uploadCloud = require('../config/cloudinary.js');
const nodemailer = require('nodemailer');
const ensureLogin = require("connect-ensure-login");


router.get('/users', (req, res, next) => {
    res.render('user/users');
})


router.get('/user/add', (req,res,next)=>{
    res.render('user/add');
})


router.post("/users/add", ensureLogin.ensureLoggedIn(), uploadCloud.single('imageUrl'), (req, res, next) => {
    const {
      name,
      email,
      password,
      type
    } = req.body;
  
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.url;
    }

    if (email == '' || password == '') {
      res.render('user/add', {
        msgError: `email and password can't be empty`
      })
      return;
    }
  
    User.findOne({ 'email': email })
    .then(user => {
      if (user !== null) {
        res.render("user/add", {
          msgError: "The email already exists!"
        });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
      }

      
      const newUser = new User({
        name,
        email,
        password: hashPass,
        imageUrl,
        token
      });
  
      let emailHTMLBody = `please confirm your email, click <a href="http://localhost:3000/confirm/${token}">here</a>`;

      newUser.save()
      .then(user => {
        transporter.sendMail({
          from: '"Rooms App" <noreply@roomsapp.com>',
          to: email, 
          subject: 'please, confirm your email - rooms app', 
          // text: message,
          html: `<b>${emailHTMLBody}</b>`
        })
        .then(info => res.redirect('/'))
        .catch(err => { throw new Error(error)})
      })
      .catch(err => { throw new Error(err)});
    })
    .catch(err => { throw new Error(err)});
  
});




module.exports = router;