const express = require('express');
const router = express.Router()
const moviesController = require('../controllers/movieController');
const middleware = require('../middleware');
router.route('/movies')
  .get(moviesController.getAllMovies)
  .post(moviesController.create);

router.route('/movies/id/:movie_id')
  .get(moviesController.getMovieById)
  .delete(middleware.verifyToken, moviesController.deleteMovieById);

router.route('/movies/name/:movie_name')
  .get(moviesController.getMovieByName)

module.exports = router;

