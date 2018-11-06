const express = require('express');
const router = express.Router();
const middleware = require('../middleware')
const userController = require('../controllers/userController');

router.route('/register')
  .get(middleware.verifyToken ,userController.getUser)
  .post(userController.create)

router.route('/me')
  .get(userController.getUser)

router.route('/login')
  .post(userController.login);
  
module.exports = router;