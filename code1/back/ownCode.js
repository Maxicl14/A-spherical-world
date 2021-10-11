const http = require('http');
const fs = require('fs').promises;

const host = 'localhost'
const port = 5000;

// This code was experimental. Don't take it too seriously.

const requestListener = (req, res) => {
  fs.readFile("../front/canvas.html")
      .then(contents => {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(contents);
      })
      .catch(err => {
            res.writeHead(500);
            res.end();
            return;
        });
}

const server = http.createServer(requestListener);
server.listen(port, host, ()=>{
  console.log(`Listening on port ${port}.`)
})
