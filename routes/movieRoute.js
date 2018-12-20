const express = require('express');
const router = express.Router()
const moviesController = require('../controllers/movieController');
const verifyToken = require('../config/verifyToken');
router.route('/movies')
  .get(moviesController.getAllMovies)
  .post(verifyToken, moviesController.create);

router.route('/movies/id/:movie_id')
  .get(moviesController.getMovieById)
  .delete(verifyToken, moviesController.deleteMovieById);

router.route('/movies/name/:movie_name')
  .get(moviesController.getMovieByName)

router.route('/movies/type/:movie_type')
  .get(moviesController.getMovieByType)
module.exports = router;

