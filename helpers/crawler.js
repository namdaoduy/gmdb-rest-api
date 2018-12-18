const https = require("superagent");
const DomParser = require('dom-parser');
const parser = new DomParser();

class Crawler {
  async crawlMovieShowtime(moveek_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" +
      moveek_id +
      "?date=" + date +
      "&version=")
      .set('Cookie', locationHanoi);

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

  async crawlMovieShowtimeFromCine(moveek_id, cine_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" +
      moveek_id +
      "?cinema=" + cine_id +
      "&date=" + date +
      "&version=")
      .set('Cookie', locationHanoi);

    const ele = parser.parseFromString(res.text, "text/html");
    const as = ele.getElementsByTagName('a');

    let data = [];

    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      data.push(element.getElementsByTagName('span')[0].textContent.slice(2, 7));
    }
    return data;
  }

  async crawlCineFromMovie(moveek_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" +
      moveek_id +
      "?date=" + date +
      "&version=")
      .set('Cookie', locationHanoi);
    let cine_list = [];
    for (let i = 0; i < res.body.cineplexes.length; i++) {
      for (let j = 0; j < res.body.cineplexes[i].cinemas.length; j++) {
        cine_list.push({
          id: res.body.cineplexes[i].cinemas[j].id,
          name: res.body.cineplexes[i].cinemas[j].name,
          latitude: res.body.cineplexes[i].cinemas[j].location.latitude,
          longitude: res.body.cineplexes[i].cinemas[j].location.longitude,
        })
      }
    }
    return cine_list;
  }

  async crawlMoveekId() {
    const res = await https.get("https://moveek.com/lich-chieu/")
    const ele = parser.parseFromString(res.text, "text/html");
    const dom = new JSDOM(ele.rawHTML);
    var movie_list = [];
    let count = 0
    while(1) {
      if (dom.window.document.getElementsByTagName('select')[0][count] == undefined) {
        break;
      }
      movie_list.push({
        moveek_id: dom.window.document.getElementsByTagName('select')[0][count].getAttribute('value'),
        name: dom.window.document.getElementsByTagName('select')[0][count].innerHTML
      })
      count= count+1;
    }
    console.log(movie_list)
    return movie_list;
  }
}

const crawler = new Crawler();
module.exports = crawler;