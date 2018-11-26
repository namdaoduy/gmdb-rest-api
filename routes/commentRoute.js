const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require('../config/verifyToken');

router.route('/movies/:movie_id/comments')
  .post(commentController.create)
  .get(commentController.getAllComments)

router.route('/movies/:movie_id/comments/:rate_id')
  .get(commentController.getCommentById)
  .delete(verifyToken, commentController.deleteById)

module.exports = router;