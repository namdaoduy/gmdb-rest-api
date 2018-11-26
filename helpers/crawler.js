const https = require("superagent");
const DomParser = require('dom-parser');
const parser = new DomParser();

class Crawler {
  crawlMovieShowtime (moveek_id, date) {
    https.get("https://moveek.com/movie/showtime/" + 
      moveek_id + 
      "?date=" + date + 
      "&version=")
    .then((res) => {
      var list_crawl = [];
      var list_crawl_group = [];

      for (var i = 0; i < res.body.cineplexes.length; i++) {
        for (var j = 0; j < res.body.cineplexes[i].cinemas.length; j++) {
          list_crawl_group.push({
            cine_id: res.body.cineplexes[i].cinemas[j].id
          });
        }
        list_crawl.push({
          cine_group_id: res.body.cineplexes[i].data.id,
          list_crawl_group: list_crawl_group,
        });
        list_crawl_group = [];
      }
    })
    return list_crawl;
  }

  crawlMovieShowtimeFromCine (moveek_id, cine_id, date) {
    https.get("https://moveek.com/movie/showtime/" + 
      moveek_id + 
      "?cinema=" + cine_id + 
      "&date=" + date + 
      "&version=")
    .then((res) => {
      var ele = parser.parseFromString(res.text, "text/html");
      var as = ele.getElementsByTagName('a');

      var data  = [];
      
      for (let index = 0; index < as.length; index++) {
        const element = as[index];
        data.push(element.getElementsByTagName('span')[0].textContent.slice(2,7));
      }
      return data;
    })
  }
}

const crawler = new Crawler();
module.exports = crawler;