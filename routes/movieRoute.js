const express = require('express');
const router = express.Router()
const moviesController = require('../controllers/movieController');
const verifyToken = require('../config/verifyToken');


router.route('/movies')
  // get all movies info
  .get(moviesController.getAllMovies)
  // create a movie, admin permission
  // .post(verifyToken, moviesController.create);
  .post(moviesController.create);
// input: movie_id
router.route('/movies/id/:movie_id')
  // find movie by id
  .get(moviesController.getMovieById)
  // delete a movie by id, admin permission
  .delete(verifyToken, moviesController.deleteMovieById);

// input: move_name
router.route('/movies/name/:movie_name')
  // find movie by name
  .get(moviesController.getMovieByName)

// input: movie_type
router.route('/movies/type/:movie_type')
  // find movie by type
  .get(moviesController.getMovieByType)

router.route('/movies/crawl')
  .get(moviesController.crawlMovieInfo);
  
module.exports = router;

