const sql = require('../config/db');
const showTimeCrawler = require('../helpers/crawler');
module.exports = {
  getMovieShowtime: function (req, res) {
    sql.query("SELECT moveek_id FROM movies WHERE movie_id = ?", req.params.movie_id, (err, result)=>{
      if(err) {
        res.send(err);
      } else {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd
        }
        if (mm < 10) {
          mm = '0' + mm
        }
        today = yyyy + '-' + mm + '-' + dd;
        showTimeCrawler.crawlMovieShowtime(result[0].moveek_id, today).then(response => {
          res.json(response);
        }).catch(err=>{res.send({err: true})});
      }
    })
  },

  getMovieShowtimeByCine: function(req, res) {
    
  }
}