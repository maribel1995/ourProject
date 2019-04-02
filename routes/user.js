const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const uploadCloud = require('../config/cloudinary.js');
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


router.get('/users',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find().sort({status:1})
    .then(users => {
      
      res.render("user/users", { users });
    })
    .catch(error => {
      throw new Error(error);
    });
})


router.get('/user/add', (req,res,next)=>{
    res.render('user/add');
})


router.post("/user/add",  uploadCloud.single('imageUrl'), (req, res, next) => {
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
        type,
        token
      });
  
      let emailHTMLBody = `please confirm your email, click <a href="http://localhost:3000/confirm/${token}">here</a>`;

      newUser.save()
      .then(user => {
        transporter.sendMail({
          from: '"Ichange" <noreply@ichange.com>',
          to: email, 
          subject: 'please, confirm your email - ichange', 
          // text: message,
          html: `<b>${emailHTMLBody}</b>`
        })
        .then(info => res.redirect('/'))
        .catch(err => { throw new Error(err)})
      })
      .catch(err => { throw new Error(err)});
    })
    .catch(err => { throw new Error(err)});
  
});


router.get('/confirm/:token', (req, res) => {
    const { token } = req.params;
  
    User.findOneAndUpdate({ token }, {$set: {status: 'active'}}, { new: true })
    .then(user => {
      // if (user.status === 'active') res.status(500).send('user already confirmed');
  
      (user) ? res.render("user/confirmation", { user }) : res.status(500).send('user not found');
    })
    .catch(err => { throw new Error(err) });
  
  });
  
  router.get('/send/confirmation', (req, res) => {
    res.render("user/confirmation-send");
  });
  
  router.post('/send/confirmation', (req, res) => {
    const { email } = req.body;
  
    User.findOne({ email })
    .then(user => {
      if (!user) res.render("user/confirmation-send", { msgError: 'user not found' });
      
      let emailHTMLBody = `please confirm your email, click <a href="http://localhost:3000/confirm/${user.token}">here</a>`;
  
      transporter.sendMail({
        from: '"Ichange" <noreply@ichange.com>',
        to: user.email, 
        subject: 'please, confirm your email - ichange.com', 
        // text: message,
        html: `<b>${emailHTMLBody}</b>`
      })
      .then(info => res.render("user/confirmation-send", { msgError: 'a new email confirmation has been sent' }))
      .catch(err => { throw new Error(err)})
      
    })
    .catch(err => { throw new Error(err) });
  
  });
  


  router.get('/user/:id', (req,res,next) =>{
    
    let userId = req.params.id;
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) return res.status(404).send('not-found');

    let loggedUser = req.user._id.equals(userId);

    User.findOne({ _id: userId })
      .then(user => {

        Product.find({owner:userId})
        .then( products =>{
          res.render("user/profile", { user, loggedUser,products } );
        })
        .catch(error => {
          throw new Error(error);
        })
        
      })
      .catch(error => {
        throw new Error(error);
      });
  });


  router.get("/user/edit/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const userId = req.params.id
  
    User.findOne({ _id: userId })
      .then(user => {
        console.log(`${req.user}`);
        if (user._id.equals(req.user._id)) {
          res.render("user/edit", { user });
        } else {
          // no access for you!
          res.redirect(`/user/${user._id}`);
        }
        
      })
      .catch(error => {
        throw new Error(error);
      });
});

router.post("/user/edit", ensureLogin.ensureLoggedIn(), uploadCloud.single('imageUrl'), (req, res, next) => {
  let { name, email, password, userId} = req.body;

  let updateData = {
    name
    
  }

  if(email){
    updateData.email = email; 
  }


  if (password) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    password = hashPass;

    updateData.password = password;

  }




  let imageUrl = '';
  if (req.file) {
    imageUrl = req.file.url;
    updateData.imageUrl = req.file.url;
  }

  User.findOneAndUpdate(
    { _id: userId },
    { $set: updateData} ,
    { new: true } 
  )
    .then(user => {
      console.log(user)
      res.redirect(`/users`);
    })
    .catch(error => {
      throw new Error(error);
    });
});


router.get("/user/delete/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let userId = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(userId)) return res.status(404).send('not-found');
  User.deleteOne({ _id: userId })
    .then(user => {
      Product.deleteMany({owner:userId})
      .then(products =>{
        res.redirect("/users");
      })
      .catch(error => {
        throw new Error(error);
    });
          
    })
    .catch(error => {
      throw new Error(error);
  });
});

module.exports = router;