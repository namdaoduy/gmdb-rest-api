const https = require("superagent");
const DomParser = require('dom-parser');
const parser = new DomParser();
const locationHanoi = 'location=YTo0OntzOjk6ImZhdm91cml0ZSI7YjowO3M6NDoidHlwZSI7czo2OiJyZWdpb24iO3M6NjoicmVnaW9uIjthOjM6e3M6MjoiaWQiO2k6OTtzOjQ6Im5hbWUiO3M6OToiSMOgIE7hu5lpIjtzOjQ6InNsdWciO3M6NjoiaGEtbm9pIjt9czo4OiJsb2NhdGlvbiI7YToyOntzOjM6ImxhdCI7czowOiIiO3M6MzoibG5nIjtzOjA6IiI7fX0%3D; path=/; domain=.moveek.com; Expires=Tue, 19 Jan 2038 03:14:07 GMT;'

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
}

const crawler = new Crawler();
module.exports = crawler;