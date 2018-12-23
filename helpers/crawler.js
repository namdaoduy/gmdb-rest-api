const https = require("superagent");
const DomParser = require('dom-parser');
const parser = new DomParser();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
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
    while (1) {
      if (dom.window.document.getElementsByTagName('select')[0][count] == undefined) {
        break;
      }
      movie_list.push({
        moveek_id: dom.window.document.getElementsByTagName('select')[0][count].getAttribute('value'),
        name: dom.window.document.getElementsByTagName('select')[0][count].innerHTML
      })
      count = count + 1;
    }
    return movie_list;
  }

  async crawlImageURL() {
    const res = await https.get("https://moveek.com/dang-chieu/")

    const ele = parser.parseFromString(res.text, "text/html");
    const dom = new JSDOM(ele.rawHTML);
    const className = dom.window.document.getElementsByClassName('panel panel-post panel-movie-grid');
    var count = 0;
    var list = [];

    while (1) {
      // if (count == 13) {
      if (className[count] == undefined) {
        break;
      }
      //if this movie doesnt have MOVEEK RATING ICON on its poster
      if (className[count].getElementsByTagName('a')[0].getElementsByTagName("img")[1] == undefined) {
        list.push({
          name: className[count].getElementsByTagName('a')[0].getAttribute('title'),
          urlTail: className[count].getElementsByTagName('a')[0].getAttribute('href').toString().slice(11),
          urlImg: className[count].getElementsByTagName('a')[0].getElementsByTagName("img")[0].getAttribute('data-srcset').split(' ')[2],
        })
      }
      else {
        list.push({
          name: className[count].getElementsByTagName('a')[0].getAttribute('title'),
          urlTail: className[count].getElementsByTagName('a')[0].getAttribute('href').toString().slice(11),
          urlImg: className[count].getElementsByTagName('a')[0].getElementsByTagName("img")[1].getAttribute('data-srcset').split(' ')[2],
        })
      }

      count = count + 1;
    }
    // console.log(list)
    return list;
  }

  // crawl all info of movies and add to Database
  async crawlMovieInfo() {
    let returnList = await this.crawlImageURL();
    let moveekIDList = await this.crawlMoveekId();
    var list = [];
    var count = 0;

    while (1) {
      if (count == returnList.length) {
        break;
      }

      // console.log(count)
      var movieURL = returnList[count].urlTail.toString();
      const res = await https.get("https://moveek.com/phim" + movieURL);

      const ele = parser.parseFromString(res.text, "text/html");
      const dom = new JSDOM(ele.rawHTML);
      var type_pick;
      let trailer_id = dom.window.document.getElementsByClassName('movie-actions clearfix m-b-sm visible-xs text-center')[0].getElementsByClassName('action action-trailer btn btn-rounded btn-lg btn-default')[1].getAttribute('data-video-url').toString()

      //conditions of TYPE when crawl
      if (dom.window.document.getElementsByClassName('col-sm-10')[0].getElementsByClassName('text-white').length === 5) {
        type_pick = 3;
      }
      else {
        type_pick = 2;
      }

      //if this movie doesnt have IMDB RATING
      if (dom.window.document.getElementsByClassName('action action-imdb btn btn-rounded btn-lg btn-icon btn-default')[1] === undefined) {

        //if this movie doesnt have AGE RATING
        if (dom.window.document.getElementsByClassName('action action-mpaa btn btn-rounded btn-lg btn-icon btn-default')[0] === undefined) {
          list.push({
            name: returnList[count].name,
            moveek_id: moveekIDList[count].moveek_id,
            age_rated: null,
            imdb_rating: null,
            types: dom.window.document.getElementsByClassName('col-sm-10')[0].getElementsByClassName('text-white')[type_pick].innerHTML.toString().split('<br>')[1].split('Thể loại: ')[1].split('\n')[0],
            duration: dom.window.document.getElementsByClassName('action action-imdb btn btn-rounded btn-lg btn-icon btn-default')[0].innerHTML.toString().split('<span>'[0].toString().split('<br'))[0],
            trailer_url: 'https://www.youtube.com/embed/' + trailer_id,
            image_url: returnList[count].urlImg,
            description: dom.window.document.getElementsByClassName('synopsis m-t m-b-xs')[0].getElementsByClassName('text-white')[0].innerHTML
          })
        }
        else {
          list.push({
            name: returnList[count].name,
            moveek_id: moveekIDList[count].moveek_id,
            age_rated: dom.window.document.getElementsByClassName('action action-mpaa btn btn-rounded btn-lg btn-icon btn-default')[0].innerHTML,
            imdb_rating: null,
            types: dom.window.document.getElementsByClassName('col-sm-10')[0].getElementsByClassName('text-white')[type_pick].innerHTML.toString().split('<br>')[1].split('Thể loại: ')[1].split('\n')[0],
            duration: dom.window.document.getElementsByClassName('action action-imdb btn btn-rounded btn-lg btn-icon btn-default')[0].innerHTML.toString().split('<span>'[0].toString().split('<br'))[0],
            trailer_url: 'https://www.youtube.com/embed/' + trailer_id,
            image_url: returnList[count].urlImg,
            description: dom.window.document.getElementsByClassName('synopsis m-t m-b-xs')[0].getElementsByClassName('text-white')[0].innerHTML
          })
        }
      }
      else {
        if (dom.window.document.getElementsByClassName('action action-mpaa btn btn-rounded btn-lg btn-icon btn-default')[0] === undefined) {
          list.push({
            name: returnList[count].name,
            moveek_id: moveekIDList[count].moveek_id,
            age_rated: null,
            imdb_rating: dom.window.document.getElementsByClassName('action action-imdb btn btn-rounded btn-lg btn-icon btn-default')[0].innerHTML.toString().split('<span>'[0].toString().split('<br'))[0],
            types: dom.window.document.getElementsByClassName('col-sm-10')[0].getElementsByClassName('text-white')[type_pick].innerHTML.toString().split('<br>')[1].split('Thể loại: ')[1].split('\n')[0],
            duration: dom.window.document.getElementsByClassName('action action-imdb btn btn-rounded btn-lg btn-icon btn-default')[1].innerHTML.toString().split('<span>'[0].toString().split('<br'))[0],
            trailer_url: 'https://www.youtube.com/embed/' + trailer_id,
            image_url: returnList[count].urlImg,
            description: dom.window.document.getElementsByClassName('synopsis m-t m-b-xs')[0].getElementsByClassName('text-white')[0].innerHTML
          })
        }
        else {
          list.push({
            name: returnList[count].name,
            moveek_id: moveekIDList[count].moveek_id,
            age_rated: dom.window.document.getElementsByClassName('action action-mpaa btn btn-rounded btn-lg btn-icon btn-default')[0].innerHTML,
            imdb_rating: dom.window.document.getElementsByClassName('action action-imdb btn btn-rounded btn-lg btn-icon btn-default')[0].innerHTML.toString().split('<span>'[0].toString().split('<br'))[0],
            types: dom.window.document.getElementsByClassName('col-sm-10')[0].getElementsByClassName('text-white')[type_pick].innerHTML.toString().split('<br>')[1].split('Thể loại: ')[1].split('\n')[0],
            duration: dom.window.document.getElementsByClassName('action action-imdb btn btn-rounded btn-lg btn-icon btn-default')[1].innerHTML.toString().split('<span>'[0].toString().split('<br'))[0],
            trailer_url: 'https://www.youtube.com/embed/' + trailer_id,
            image_url: returnList[count].urlImg,
            description: dom.window.document.getElementsByClassName('synopsis m-t m-b-xs')[0].getElementsByClassName('text-white')[0].innerHTML
          })
        }
      }

      count = count + 1;
    }
    return list;
  }
}

const crawler = new Crawler();
module.exports = crawler;