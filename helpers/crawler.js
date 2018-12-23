const https = require("superagent");
const DomParser = require('dom-parser');
const parser = new DomParser();
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const locationHanoi = 'location=YTo0OntzOjk6ImZhdm91cml0ZSI7YjowO3M6NDoidHlwZSI7czo2OiJyZWdpb24iO3M6NjoicmVnaW9uIjthOjM6e3M6MjoiaWQiO2k6OTtzOjQ6Im5hbWUiO3M6OToiSMOgIE7hu5lpIjtzOjQ6InNsdWciO3M6NjoiaGEtbm9pIjt9czo4OiJsb2NhdGlvbiI7YToyOntzOjM6ImxhdCI7czowOiIiO3M6MzoibG5nIjtzOjA6IiI7fX0%3D; path=/; domain=.moveek.com; Expires=Tue, 19 Jan 2038 03:14:07 GMT;'

class Crawler {
  //crawl cine group ID, cine ID and movieID from MoveekID
  async crawlCineIDandMovieIDfromMoveek(moveek_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" +
      moveek_id +
      "?date=" + date +
      "&version=")
      .set('Cookie', locationHanoi);

    let list_crawl = [];
    let list_crawl_group = [];

    for (let i = 0; i < res.body.cineplexes.length; i++) {
      for (let j = 0; j < res.body.cineplexes[i].cinemas.length; j++) {
        await this.crawlMovieShowtimeFromCine(moveek_id, res.body.cineplexes[i].cinemas[j].id, date)
        .then((res2) => {
          list_crawl_group.push({
            cine_id: res.body.cineplexes[i].cinemas[j].id,
            cine_name: res.body.cineplexes[i].cinemas[j].name,
            showtime: res2,
          });
        })   
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

  //crawl movie showtime from moveek id and cine id
  async crawlMovieShowtimeFromCine(moveek_id, cine_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" +
      moveek_id +
      "?cinema=" + cine_id +
      "&date=" + date +
      "&version=")
      .set('Cookie', locationHanoi)
      .catch(err => {
        console.log(err)
      });

    const ele = parser.parseFromString(res.text, "text/html");
    const as = ele.getElementsByTagName('a');

    let data = [];

    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      data.push(element.getElementsByTagName('span')[0].textContent.slice(2, 7));
    }
    return data;
  }

  // if you have a moveek id, you can know which cinemas display that movie and those coordination
  async crawlCineFromMovie(moveek_id, date) {
    const res = await https.get("https://moveek.com/movie/showtime/" +
      moveek_id +
      "?date=" + date +
      "&version=")
      // .set('Cookie', locationHanoi);
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

  // crawl all DISPLAYING MOVIES at all cinemas (actually at this moment it's Hanoi)
  async crawlMoveekId() {
    const res = await https.get('https://moveek.com/lich-chieu/');
    const ele = parser.parseFromString(res.text, 'text/html');
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
    return movie_list;
  }
}

const crawler = new Crawler();
module.exports = crawler;