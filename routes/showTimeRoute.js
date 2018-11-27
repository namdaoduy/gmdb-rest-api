const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.route('/showtime/:movie_id')
  .get(showtimeController.getMovieShowtime);

router.route('showtime/:movie_id/cinema/:cine_id')
  .get(showtimeController.getMovieShowtimeByCine);
module.exports = router;