const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require('../config/verifyToken');

// input: movie_id
router.route('/movies/:movie_id/comments')
  // create new comment 
  .post(commentController.create)
  // get all comment from a film 
  .get(commentController.getAllComments)

// input: movie_id, rate_id
router.route('/movies/:movie_id/comments/:rate_id')
  // get a comment by id
  .get(commentController.getCommentById)
  // delete a comment, admin permission
  // .delete(verifyToken, commentController.deleteById)
  .delete(commentController.deleteById)
module.exports = router;