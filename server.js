const express = require('express');
const hbs = require('hbs');
const Request = require('request');

var app = express();

var after = "";
var dist = 0;
var port = process.env.PORT || 3000;

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
  let likes = query.likes;
  (async () => {
    var encodedText = text.toLowerCase();
    encodedText = encodeURI(encodedText);
    getPosts(encodedText, time, likes);
    var check = () => {
      console.log('.')
      if(after == null)
        res.render('results.hbs', {
          dist: `Se encontraron ${dist} usuarios hablando acerca de ${text}.`
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

function getPosts(text, time, filter) {
  console.log(text)
  console.log(time)
  console.log(filter);
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
        switch(filter){
          case "": dist = dist + getComments(res.data.children);
                   break;
          case "10_likes": dist = getLikes(res.data.children, dist, 10);
                           break;
          case "50_likes": dist = getLikes(res.data.children, dist, 50);
                           break;
          case "100_likes": dist = getLikes(res.data.children, dist, 100);
                            break;
          case "1000_likes": dist = getLikes(res.data.children, dist, 1000);
                             break;
          case "10000_likes": dist = getLikes(res.data.children, dist, 10000);
                              break;
          case "50000_likes": dist = getLikes(res.data.children, dist, 50000);
                              break;
        }

      }
      console.log(after);
      console.log(dist);
      getPosts(text, time, filter)
    });
  }
}
function getComments(children){
  var comments = 0;
  for (i=0; i<children.length; i++){
    comments+=children[i].data.num_comments;
  }
  return comments;
}

function getLikes(children, dist, likes){
  for(i=0; i<children.length; i++){
    console.log(`Dist: ${dist}   Likes: ${children[i].data.score}`);
    if ( (children[i].data.score < likes) || (!children[i].data.score) )
      dist--;
    else
      dist += getComments(children);
  }
  return dist;
}



app.listen(port, () => {
  console.log('El servidor está en el puerto 3000');
});
