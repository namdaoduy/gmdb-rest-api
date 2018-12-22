const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

// get all displaying movie showtime <ERROR>
router.route('/showtime')
  .get(showtimeController.getAllDisplayingMovie);
// input: movie_id
router.route('/showtime/:movie_id')
  // get movie showtime
  .get(showtimeController.getMovieShowtime);

// input: movie_id, cine_id
router.route('/showtime/:movie_id/cinema/:cine_id')
  // get movie showtime from a cine
  .get(showtimeController.getMovieShowtimeByCine);

module.exports = router;