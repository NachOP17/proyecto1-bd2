const express = require('express');
const hbs = require('hbs');
const Request = require('request');

var app = express();

var after = "";
var dist = 0;

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index.hbs', {
    dist: 'Inserte la palabra o la frase que desea buscar en Reddit'
  });
});

app.get('/search', (req, res) => {
  after = "";
  dist = 0;
  console.log(req.query);
  let jsonRes = req;
  let query = jsonRes.query;
  let text = query.texto;
  let time = query.tiempo;
  (async () => {
    text = text.toLowerCase();
    text = encodeURI(text);
    getPosts(text, time);
    var check = () => {
      console.warn('checking')
      if(after == null)
        res.render('index.hbs', {
          dist: dist
        })
      else
        setTimeout(check, 100)
    }
    setTimeout(check, 100)
  })()
})



function getPosts(text, time) {
  console.log(text)
  console.log(time)
  var endpoint = 'https://www.reddit.com/search.json?q=' + text + '&limit=100&t=' + time;
  console.log("Se ejecuto")
  if (after == null) {
    return null
  } else if (after == "") {
    Request.get(endpoint, (error, response, body) => {
      if (error) {
        return console.log(error);
      }
      let res = JSON.parse(body);
      after = res.data.after;
      console.log(res.data.dist)
      dist = dist + Number(res.data.dist);
      console.log(after);
      console.log(dist);
      getPosts(text, time)
    });
  } else {
    Request.get(`https://www.reddit.com/search.json?q=${text}&t=${time}limit=100&after=${after}`, (error, response, body) => {
      if (error) {
        return console.log(error);
      }
      let res = JSON.parse(body);
      after = res.data.after;
      console.log(res.data.dist)
      dist = dist + Number(res.data.dist);
      console.log(after);
      console.log(dist);
      getPosts(text, time)
    });
  }
}

app.listen(3000, () => {
  console.log('El servidor está en el puerto 3000');
});
