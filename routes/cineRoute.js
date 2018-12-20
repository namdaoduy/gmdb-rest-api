const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.route('/cine/:movie_id')
  .get(showtimeController.getCineByMovie);

router.route('/nearestcine/:movie_id')
  .get(showtimeController.getNearestCine);
module.exports = router;