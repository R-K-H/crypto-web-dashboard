const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const http = require('http');
const url = require('url');
const CoinMarketCap = require('coinmarketcap-api');
const WebSocket = require('ws');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const client = new CoinMarketCap()

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  setInterval(function() {
    console.log('tick')
    client.getTicker({convert: 'USD'})
    .then(result => {
      ws.send(JSON.stringify(result))
    })
    .catch(console.error)
  }, 10500);
});


app.get('/', function (req, res) {
	res.sendFile('index.html');
});

app.get('/market', function(req, res) {
	client.getTicker({convert: 'USD'})
	.then(result => {
		res.status(201).send(result).end();
	})
	.catch(console.error)
})

app.use(function (req, res) {
  res.send({ msg: "hello" });
});



server.listen(8088, function listening() {
  console.log('Listening on %d', server.address().port);
});

app.listen(8080, function () {
  console.log('App Running');
});