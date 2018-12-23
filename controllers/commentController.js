const sql = require('../config/db');

module.exports = {
  create: function(req, res) {
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      point: req.body.point,
      movie_id: req.params.movie_id
    }
    if(!newComment||!newComment.name||!newComment.email||!newComment.comment||!newComment.point) {
      res.status(401).send(err);
    } else {
      sql.query('INSERT INTO rates SET ?', newComment, (err, result)=>{
        if(err) res.send(err);
        else {
          res.status(200).send({message: "Query successful", comment: result});
        }
      })
    }
  },

  getAllComments: function(req, res) {
    sql.query("SELECT name, email, comment, point FROM rates WHERE movie_id = ?", req.params.movie_id, (err, result)=>{
      if(err) res.send(err);
      else res.send(result);
    })
  },

  getCommentById: function(req, res) {
    sql.query("SELECT name, email, comment, point rates WHERE movie_id = ? AND rate_id = ?", [req.params.movie_id, req.params.rate_id], (err, result)=>{
      if(err) res.send(err);
      else res.send(result[0]);
    })
  },

  deleteById: function(req, res) {
    sql.query("DELETE FROM rates WHERE movie_id = ? AND rate_id = ?", [req.params.movie_id, req.params.rate_id], (err, result)=>{
      if(err) res.send(err);
      else res.send({message: "Delete successful"});
    })
  }

}