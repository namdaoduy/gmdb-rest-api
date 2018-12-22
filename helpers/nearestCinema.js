const DomParser = require('dom-parser');
const parser = new DomParser();
const Crawler = require('./crawler.js');

class Cinema {
  suggestShowTime(latitude, longitude, moveek_id, date) {
    var crawler = new Crawler();
    var distances = [];
    var nearest_cinemas = [];
    var suggest_list = [];
    const time = new Date().toLocaleTimeString().slice(0, 5);
    //find all cinemas which display this movie
    crawler.crawlCineFromMovie(moveek_id, date)
      .then((cine_list) => {
        for (let i = 0; i < cine_list.length; i++) {
          distances.push({
            id: cine_list[i].id,
            name: cine_list[i].name,
            distance: Math.sqrt(Math.pow(cine_list[i].latitude - latitude, 2) + Math.pow(cine_list[i].longitude - longitude, 2)),
          })
        }
        distances.sort((a, b) => {
          return a.distance - b.distance
        })
        nearest_cinemas = distances.slice(0, 5)
      })
      .then(async () => {
        //find showtime for those nearest cinemas
        for (var i = 0; i < nearest_cinemas.length; i++) {
          await crawler.crawlMovieShowtimeFromCine(moveek_id, nearest_cinemas[i].id, date)
            .then(result => {
              var result_after = []
              for (var i = 0; i < result.length; i++) {
                if (result_after.length == 2) {
                  break;
                }
                //compare showtime and time now
                if (result[i].localeCompare(time) == 1) {
                  result_after.push(result[i])
                }
              }
              return result_after;
            })
            .then(result_after => {
              if (result_after.length != 0) {
                suggest_list.push({
                  id: nearest_cinemas[i].id,
                  name: nearest_cinemas[i].name,
                  distance: nearest_cinemas[i].distance,
                  showtime: result_after,
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
        console.log(time)
        console.log(suggest_list)
        return suggest_list
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const cinema = new Cinema();
module.exports = cinema;