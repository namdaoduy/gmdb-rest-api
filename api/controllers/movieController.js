// Create Movie object to provide function like creating new movie, get all movies
// get movies by id, update movies by id and delete movies by id

const sql = require('../../db.js');

// Movie object constructor
const Movie = function (movie) {
  this.movie_id = movie_id;
  this.name = name;
  this.imdb_rating = imdb_rating;
  this.cgv_url = cgv_url;
  this.lotte_url = lotte_url;
  this.beta_url = beta_url;
  this.age_rated = age_rated;
  this.image_url = image_url;
  this.trailer_url = trailer_url;
  this.main_actors = main_actors;
  this.types = types;
  this.release_date = release_date;
  this.description = description;
  this.updated_at = Date.now();
  this.created_at = Date.now();
}

// Movie.createMovie = function (req, res) {
//   const newMovie = new Movie(req.body);
//   sql.query('INSERT INTO movies SET ?', newMovie, (err, result)=>{
//     // handle null error
//     if( ) {
//       res.status(400).send({
//         error: true,
//         message: "Null error"
//       })
//     } else {
//       if(err) res.send(err)
//       res.json(result)
//     }
//   })
// }

Movie.getMovieById = function (req, res) {
  const movie_id = req.params.movie_id;
  sql.query('SELECT * FROM movies WHERE movie_id = ?', movie_id, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result)
    }
  })
}

Movie.getAllMovies = function (req, res) {
  sql.query('SELECT * FROM movies', (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
}

Movie.updateById = function (req, res) {
  sql.query('UPDATE movies SET movie = ? WHERE movie_id = ?', [movie.movie, req.params.movie_id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
}

Movie.remove = function (req, res) {
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
module.exports = Movie;