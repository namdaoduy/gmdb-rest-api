// Create Movie object to provide function like creating new movie, get all movies
// get movies by id, update movies by id and delete movies by id

const sql = require('../config/db');
const download = require('../helpers/download');
const crawler = require('../helpers/crawler');

module.exports = {
  create: function (req, res) {
    const img_name = req.body.moveek_id;
    download(req.body.image_url, img_name+'.jpg', ()=>{
      console.log({done: true});
    })
    const newMovie = {
      name: req.body.name,
      imdb_rating: req.body.imdb_rating,
      image_url: "/images/" + img_name + '.jpg',
      trailer_url: req.body.trailer_url,
      main_actors: req.body.main_actors,
      types: req.body.types,
      description: req.body.description,
      moveek_id: req.body.moveek_id,
      duration: req.body.duration
    }
    if(!newMovie.name || !newMovie.imdb_rating || !newMovie.trailer_url || !newMovie.main_actors || !newMovie.types || !newMovie.description || !newMovie.moveek_id || !newMovie.duration) {
      res.send(err);
      return;
    }
    sql.query('INSERT INTO movies SET ?', newMovie, (err, result) => {
      if (err) res.send(err);
      res.json({done: true});
    })
  },

  getMovieByName: function (req, res) {
    const movieName = '%' + req.params.movie_name + '%';
    sql.query('SELECT * FROM movies WHERE name LIKE ? AND deleted_at is null', movieName, (err, result) => {
      if (err) res.send(err);
      else {
        res.json(result);
      }
    })
  },

  getMovieById: function (req, res) {
    const movie_id = req.params.movie_id;
    sql.query(`select movies.*, r.gmdb_rating from movies
    left join (select movie_id,round(avg(point),1) as gmdb_rating from rates group by (movie_id)) as r
    on movies.movie_id = r.movie_id where movies.movie_id = ?;`, movie_id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result[0])
      }
    })
  },

  getAllMovies: function (req, res) {
    sql.query('SELECT * FROM movies where deleted_at is null', (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    })
  },

  deleteMovieById: function (req, res) {
    const movie_id = req.params.movie_id;
    sql.query('UPDATE movies SET deleted_at = NOW() where movie_id = ?', movie_id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json({message: "Successfully deleted"})
      }
    })
  },

  updateMovieById: function(req, res) {
    const updateMovie = {
      name: req.body.name,
      imdb_rating: req.body.imdb_rating,
      age_rated: req.body.age_rated,
      trailer_url: req.body.trailer_url,
      main_actors: req.body.main_actors,
      types: req.body.types,
      description: req.body.description,
      duration: req.body.duration
    }
    sql.query('UPDATE movies SET ? WHERE movie_id = ?', [updateMovie, req.params.movie_id], (err, result)=>{
      if(err) res.send(err);
      else res.json(result);
    })
  },

  getMovieByType: function(req, res) {
    const type = '%' + req.params.movie_type + '%';
    sql.query('SELECT * FROM movies WHERE types LIKE ? and deleted_at is null', type, (err, result)=>{
      if(err) {
        res.send(err);
      } else {
        res.json(result);
      }
    })
  },

  crawlMovieInfo: function(req, res) {
    crawler.crawlMovieInfo().then(response=>{
      let list_moveek_id = [];
      sql.query('SELECT moveek_id FROM movies', (err, result)=>{
        if(err) res.send(err);
        else {
          result.forEach(ele => {
            list_moveek_id.push(ele.moveek_id);
          })
        }
        for(let i = 0; i < response.length; i++) {
          if(!list_moveek_id.includes(response[i].moveek_id)) {
            const image_name = response[i].moveek_id;
            download(response[i].image_url, image_name+'.jpg', ()=>{})
            response[i].image_url = '/images/' + image_name + '.jpg';
            sql.query('INSERT INTO movies SET ?', response[i], (err, result)=>{
              if(err) {
                res.send(err);
              }
            })
          }
        }
      })
    }).then(()=>{
      res.send({done: true})
    }).catch(err=>{res.send({err: true})});
  }
}
