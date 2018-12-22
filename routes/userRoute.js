const express = require('express');
const router = express.Router();
const verifyToken = require('../config/verifyToken');
const userController = require('../controllers/userController');

// register user
router.route('/register')
  .get(verifyToken, userController.getUser)
  .post(verifyToken ,userController.create)

// router.route('/me')
//   .get(verifyToken, userController.getUser)

// login route: get token 
router.route('/login')
  .post(userController.login);

module.exports = router;