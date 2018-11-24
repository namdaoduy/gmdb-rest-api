// Create Movie object to provide function like creating new movie, get all movies
// get movies by id, update movies by id and delete movies by id
const jwt = require('jsonwebtoken');
const sql = require('../config/db');
const config = require('../config/config');

module.exports = {
  create: function (req, res) {
    const newMovie = {
      name: req.body.name,
      imdb_rating: req.body.imdb_rating,
      image_url: req.body.image_url,
      trailer_url: req.body.trailer_url,
      main_actors: req.body.main_actors,
      types: req.body.types,
      description: req.body.description,
      moveek_id: req.body.moveek_id,
      cine_id: req.body.cine_id
    }
    sql.query('INSERT INTO movies SET ?', newMovie, (err, result) => {
      if (err) res.send(err);
      res.json(result);
    })
  },

  getMovieByName: function(req, res) {
    const movieName = '%' + req.params.movie_name + '%';
    sql.query('SELECT name FROM movies WHERE name LIKE ? LIMIT 5', movieName, (err, result) => {
      if(err) res.send(err);
      else {
        res.json(result);
      }
    })
  },

  getMovieById: function (req, res) {
    const movie_id = req.params.movie_id;
    sql.query('SELECT * FROM movies WHERE movie_id = ?', movie_id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result)
      }
    })
  },

  getAllMovies: function (req, res) {
    sql.query('SELECT * FROM movies', (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    })
  },

  deleteMovieById: function (req, res) {
    jwt.verify(req.token, config.secret, (err, authData) => {
      if (err) res.send(403);
      else {
        const movie_id = req.params.movie_id;
        sql.query('DELETE FROM movies WHERE movie_id = ?', movie_id, (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.json({
              message: "Successfully deleted"
            })
          }
        })
      }
    })

  }
}