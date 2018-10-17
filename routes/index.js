const router = require('express').Router();
const passport = require('passport');

router.route('/login')
  .get((req, res) => {

  })
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

module.exports = router;