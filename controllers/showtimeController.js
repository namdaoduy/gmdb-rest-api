const sql = require('../config/db');
const showTimeCrawler = require('../helpers/crawler');

function getDay() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

module.exports = {
  getMovieShowtime: function (req, res) {
    sql.query("SELECT moveek_id FROM movies WHERE movie_id = ?", req.params.movie_id, (err, result)=>{
      if(err) {
        res.send(err);
      } else {
        showTimeCrawler.crawlMovieShowtime(result[0].moveek_id, getDay()).then(response => {
          res.json(response);
        }).catch(err=>{res.send({err: true})});
      }
    })
  },

  getMovieShowtimeByCine: function(req, res) {
    sql.query("SELECT moveek_id FROM movies WHERE movie_id = ?", req.params.movie_id, (err, result)=>{
      if(err) {
        res.send(err);
      } else {
        showTimeCrawler.crawlMovieShowtimeFromCine(result[0].moveek_id, req.params.cine_id, getDay()).then(response => {
          res.json(response);
        }).catch(err=>{res.send({err: true})});
      }
    })
  },

  getCineByMovie: function(req, res) {
    sql.query("SELECT moveek_id FROM movies WHERE movie_id = ?", req.params.movie_id, (err, result) => {
      if(err) {
        res.send(err);
      } else {
        showTimeCrawler.crawlCineFromMovie(result[0].moveek_id, getDay()).then(response => {
          res.json(response);
        }).catch(err=>{res.send({err: true})});
      }
    })
  }
}