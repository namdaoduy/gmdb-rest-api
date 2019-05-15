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
    const res = await https.get("https://moveek.com/dang-chieu/");
    const ele = parser.parseFromString(res.text, "text/html");
    const dom = new JSDOM(ele.rawHTML);
    const allMovies = dom.window.document.querySelector('.row.grid');
    const movieArray = [].slice.call(allMovies.children);
    const list = [];

    movieArray.forEach((movie) => {
      const link = movie.querySelector('a');
      const urlTail = link.getAttribute('href');
      const name = link.getAttribute('title');
      const urlImg = link.querySelector('img')
        .getAttribute('data-srcset').split(' ')[2];
      list.push({
        name,
        urlTail,
        urlImg,
      })
    });

    // while (1) {
    //   // if (count == 13) {
    //   if (className[count] == undefined) {
    //     break;
    //   }
    //   //if this movie doesnt have MOVEEK RATING ICON on its poster
    //   if (className[count].getElementsByTagName('a')[0].getElementsByTagName("img")[1] == undefined) {
    //     list.push({
    //       name: className[count].getElementsByTagName('a')[0].getAttribute('title'),
    //       urlTail: className[count].getElementsByTagName('a')[0].getAttribute('href').toString().slice(11),
    //       urlImg: className[count].getElementsByTagName('a')[0].getElementsByTagName("img")[0].getAttribute('data-srcset').split(' ')[2],
    //     })
    //   }
    //   else {
    //     list.push({
    //       name: className[count].getElementsByTagName('a')[0].getAttribute('title'),
    //       urlTail: className[count].getElementsByTagName('a')[0].getAttribute('href').toString().slice(11),
    //       urlImg: className[count].getElementsByTagName('a')[0].getElementsByTagName("img")[1].getAttribute('data-srcset').split(' ')[2],
    //     })
    //   }

    //   count = count + 1;
    // }
    // console.log(list)
    // console.log(list);
    return list;
  }

  // crawl all info of movies and add to Database
  async crawlMovieInfo() {
    const movieList = await this.crawlImageURL();
    let list = [];

    for (const movie of movieList) {
      const res = await https.get(`https://moveek.com${movie.urlTail}`);
      const ele = parser.parseFromString(res.text, "text/html");
      const dom = new JSDOM(ele.rawHTML);
      const { document } = dom.window;

      const moveek_id = document.querySelector('a[title="Soạn đánh giá"]')
        .getAttribute('href').slice(12);

      const info = [].slice.call(document.querySelector('.row.mb-3').querySelectorAll('.col.text-center.text-sm-left'));

      const age_rated = (info.length >= 1)
        ? info[info.length - 1].querySelectorAll('span')[1].innerHTML
        : null;

      const types = document.querySelector('.mb-0.text-muted.text-truncate').innerHTML
        .replace(/ +?/g, '')
        .replace(/\r?\n|\r/g, '')
        .split('-')[1];
      
      const duration = (info.length >= 2)
        ? info[info.length - 2].querySelectorAll('span')[1].innerHTML.split(' ')[0]
        : null;

      const trailer_url = 'https://www.youtube.com/embed/' + document.querySelector('.btn.btn-outline-light.btn-sm')
        .getAttribute('data-video-url');
      
      const description = document.querySelector('.mb-3.text-justify').innerHTML;

      const result = {
        name: movie.name,
        moveek_id,
        age_rated,
        imdb_rating: null,
        types,
        duration,
        trailer_url,
        image_url: movie.urlImg,
        description,
      };
      list.push(result);
    }
    return list;
  }
}

const crawler = new Crawler();
module.exports = crawler;