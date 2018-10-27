const express = require('express');
const router = express.Router()
const moviesController = require('../controllers/movieController');

router.route('/movies')
  .get(moviesController.getAllMovies)
  // .post(moviesController.create);

router.route('/movies/:movie_id')
  .get(moviesController.getMovieById)
  // .put(moviesController.update)
  .delete(moviesController.remove);

module.exports = router;

