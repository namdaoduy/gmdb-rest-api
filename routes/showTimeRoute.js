const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.route('/movies/showtime/:movie_id')
  .get(showtimeController.getMovieShowtime);

// router.route('/movies/showtime/:movie_id/:cine_id')
module.exports = router;