const express = require('express');
const hbs = require('hbs');
const Request = require('request');

var app = express();

var after = "";
var dist = 0;

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index.hbs');
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
    var encodedText = text.toLowerCase();
    encodedText = encodeURI(encodedText);
    getPosts(encodedText, time);
    var check = () => {
      console.warn('checking')
      if(after == null)
        res.render('results.hbs', {
          dist: `Se encontraron ${dist} posts que contienen la frase ${text}.`
        })
      else
        setTimeout(check, 100)
    }
    setTimeout(check, 100)
  })()
})

function getRedditEndpoint(text, time) {
  var endpoint = 'https://www.reddit.com/search.json?q=' + text + '&limit=100&t=' + time;
  if (after != "") {
    endpoint = endpoint + '&after=' + after;
  }
  return endpoint;
}

function getPosts(text, time) {
  console.log(text)
  console.log(time)
  var endpoint = getRedditEndpoint(text, time);
  console.log(endpoint);
  if (after == null) {
    return null;
  } else {
    Request.get(endpoint, (error, response, body) => {
      if (error) {
        return console.log(error);
      }
      let res = JSON.parse(body);
      if (res.data != null) {
        after = res.data.after;
        console.log(res.data.dist)
        dist = dist + Number(res.data.dist);
      }
      console.log(after);
      console.log(dist);
      getPosts(text, time)
    });
  }
}

app.listen(3000, () => {
  console.log('El servidor está en el puerto 3000');
});
