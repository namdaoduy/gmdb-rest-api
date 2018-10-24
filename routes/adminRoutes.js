const router = require('express').Router();
const passport = require('passport');
const db = require('../db');
//// AUTHENTICATION ROUTE
router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }).then((req, res) =>{ })
  )

module.exports = router;