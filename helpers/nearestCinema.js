const DomParser = require('dom-parser');
const parser = new DomParser();
const Crawler = require('./crawler.js');

class Cinema {
  findNearestCinema(latitude, longitude, moveek_id, date) {
    var crawler = new Crawler();
    var distances = [];
    crawler.crawlCineFromMovie(15184,2018-12-16)
      .then((cine_list) => {
        for (let i = 0; i < cine_list.length; i++) {
          distances.push({
            id: cine_list[i].id,
            name: cine_list[i].name,
            distance: Math.sqrt(Math.pow(cine_list[i].latitude-latitude,2) + Math.pow(cine_list[i].longitude-longitude,2)),
          })
        }
        distances.sort((a,b) => {
          return a.distance - b.distance
        })
        console.log(distances)
        console.log(this.findMin(distances));
        return this.findNameOfMin(distances)
      })
      .catch((err) =>{
        console.log(err)
      })
  }
  findNameOfMin(list) {
    var min = list[0].distance;
    var name;
    for (var i = 0; i < list.length; i++) {
      if (list[i].distance < min) {
        min = list[i].distance;
        name = list[i].name;
      }
    }
    return name;
  }
}

const cinema = new Cinema();
module.exports = cinema;