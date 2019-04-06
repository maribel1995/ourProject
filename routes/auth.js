const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { 'errorMessage': req.flash('error') });
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}), (req, res) => {
  try {
    const { returnTo } = req.session;
    if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
      delete req.session.returnTo;
      return res.redirect(returnTo);
    }
  } catch (e) {
    // just redirect normally below
  }
  res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
})
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
