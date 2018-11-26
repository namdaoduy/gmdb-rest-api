const express = require('express');
const router = express.Router();
const verifyToken = require('../config/verifyToken');
const userController = require('../controllers/userController');

router.route('/register')
  .get(verifyToken, userController.getUser)
  .post(verifyToken, userController.create)

router.route('/me')
  .get(verifyToken, userController.getUser)

router.route('/login')
  .post(userController.login);

router.route('/logout')
  
module.exports = router;