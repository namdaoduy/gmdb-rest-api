const https = require("superagent");
const DomParser = require('dom-parser');
const parser = new DomParser();

class Crawler {
  async crawlMovieShowtime (moveek_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" + 
      moveek_id + 
      "?date=" + date + 
      "&version=");

    let list_crawl = [];
    let list_crawl_group = [];

    for (let i = 0; i < res.body.cineplexes.length; i++) {
      for (let j = 0; j < res.body.cineplexes[i].cinemas.length; j++) {
        list_crawl_group.push({
          cine_id: res.body.cineplexes[i].cinemas[j].id,
          cine_name: res.body.cineplexes[i].cinemas[j].name
        });
      }
      list_crawl.push({
        cine_group_id: res.body.cineplexes[i].data.id,
        cine_group_name: res.body.cineplexes[i].data.name,
        list_crawl_group: list_crawl_group,
      });
      list_crawl_group = [];
    }
    return list_crawl;
  }

  async crawlMovieShowtimeFromCine (moveek_id, cine_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" + 
      moveek_id + 
      "?cinema=" + cine_id + 
      "&date=" + date + 
      "&version=");

    const ele = parser.parseFromString(res.text, "text/html");
    const as = ele.getElementsByTagName('a');

    let data  = [];
    
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      data.push(element.getElementsByTagName('span')[0].textContent.slice(2,7));
    }
    return data;
  }

  async crawlCineFromMovie (moveek_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" + 
      moveek_id + 
      "?date=" + date + 
      "&version=");
  }
}

const crawler = new Crawler();
module.exports = crawler;