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

app.post('/search', (req, res) => {
  after = "";
  dist = 0;
  getPosts(res)
})

function getPosts(response) {
  console.log("Se ejecuto")
  if (after == null) {
    response.render('index.hbs', {
      dist: dist
    });
  } else if (after == "") {
    Request.get(`https://www.reddit.com/search.json?q=hello&t=day`, (error, response, body) => {
      if (error) {
        return console.log(error);
      }
      let res = JSON.parse(body);
      after = res.data.after;
      dist = dist + Number(res.data.dist);
      console.log(after);
      console.log(dist);
      getPosts(response)
    });
  } else {
    Request.get(`https://www.reddit.com/search.json?q=hello&t=day&after=${after}`, (error, response, body) => {
      if (error) {
        return console.log(error);
      }
      let res = JSON.parse(body);
      after = res.data.after;
      dist = dist + Number(res.data.dist);
      console.log(after);
      console.log(dist);
      getPosts(response)
    });
  }
}

app.listen(3000, () => {
  console.log('El servidor está en el puerto 3000');
});
