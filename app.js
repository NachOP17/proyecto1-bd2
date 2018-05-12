var Request = require('request');
var after = ""
var dist = 0;

getPosts()

function getPosts() {
  console.log("Se ejecuto")
  if (after == null) {
    return null
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
      getPosts()
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
      getPosts()
    });
  }

}
