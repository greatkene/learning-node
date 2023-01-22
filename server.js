const http = require("http");
const fs = require("fs");

const _ = require("lodash");

// method for creating server

const server = http.createServer((req, res) => {
  //   console.log(req.url, req.method);

  // Lodash
  const num = _.random(12, 20);
  console.log(num);

  // executing a function only once
  const greet = _.once(() => {
    console.log("hello");
  });

  greet();

  //   Gving a response
  // set header content type
  res.setHeader("Content-Type", "text/html");

  //   Basic routing
  let path = "./views/";
  switch (req.url) {
    case "/":
      path += "index.html";
      res.statusCode = 200;
      break;
    case "/about-us":
      path += "about.html";
      res.statusCode = 200;
      break;
    //   redirect
    case "/about-them":
      res.statusCode = 301;
      res.setHeader("Location", "/about-us");
      res.end();
      break;
    default:
      path += "404.html";
      res.statusCode = 404;
      break;
  }

  //Send an html file
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.write(data);
      res.end();
    }
  });
});

server.listen(3001, "localhost", () => {
  console.log("Listening for request on Port 3001");
});
