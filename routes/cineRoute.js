const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.route('/cine/:movie_id')
  .get(showtimeController.getCineByMovie);

module.exports = router;