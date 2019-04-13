const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Question = require('../models/question');
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");
const Order = require('../models/order');



router.get('/products',ensureLogin.ensureLoggedIn(), (req, res, next) => {

    
    Product.find({owner:{$eq:req.user._id}}).populate('owner').sort({createdAt:-1})
        
        .then(products => {
            
            res.render('product/products', {
                products
            });
        })
        .catch(err => {
            throw new Error(err);
        })
});

router.get('/products/add',ensureLogin.ensureLoggedIn(), (req, res, next) => {
    res.render('product/add');
});

router.post('/products/add',ensureLogin.ensureLoggedIn(), uploadCloud.array('photo'), (req, res, next) => {
    const files = req.files;
    const images = new Array();
    const {
        name,
        description,
        owner,
        category,
        stared
    } = req.body;

    files.forEach(file => {
        images.push(file.url);
    });

    const newProduct = new Product({
        name,
        description,
        owner,
        category,
        stared,
        images
    });
    
    newProduct.save()
        .then((product) => {
            res.redirect('/products');
        }).catch((err) => {
            throw new Error(err);
        });
});

router.get('/products/edit/:id',ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Product.findOne({
            _id: req.params.id
        })
        .then(product => {

            res.render('product/edit', {
                product
            })
        })
});

router.post('/products/edit',ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const {
        name,
        description,
        //owner,
        category,
        stared,
        productId
    } = req.body;

    Product.update({
            _id: productId
        }, {
            $set: {
                name,
                description,
                category,
                stared
            }
        }, {
            new: true
        })
        .then(product => {
            res.redirect('/products')
        })
        .catch(error => {
            throw new Error(error)
        });
});

router.get('/products/perfil/:id',ensureLogin.ensureLoggedIn(), (req, res, next) => {

    let loggedUser = req.user._id;


    Product.find({owner:loggedUser}).populate('owner')
    .then(products =>{
        Product.findOne({
            _id: req.params.id
        })
      .populate({
        path:'questions',
        populate: {
            path:'user'
        }
    }).populate('owner')
        .then(product => {
            let authUser = req.user._id.equals(product.owner._id);
            console.log(authUser);
            res.render('product/perfil', {
                product, products, authUser
            })
        })
        .catch(err => {throw new Error(err)});    
    })
    .catch(err => {throw new Error(err)});
    
})



router.post('/products/uploadImages', uploadCloud.array('photo'), (req, res, next) => {
    const productId = req.body.productId;
    const files = req.files;
    const images = new Array();

    files.forEach(file => {
        images.push(file.url);
    })
    Product.update({
            _id: productId
        }, {
            $set: {
                images
            }
        }, {
            new: true
        })
        .then(product => {
            res.redirect(`/products/edit/${productId}`)
        })
        .catch(err => {
            throw new Error(err)
        })


});


router.get("/products/delete/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
    let productId = req.params.id;
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) return res.status(404).send('not-found');
    Product.deleteOne({ _id: productId })
      .then(user => {
       
          res.redirect("/products");
        
            
      })
      .catch(error => {
        throw new Error(error);
    });
  });




module.exports = router;