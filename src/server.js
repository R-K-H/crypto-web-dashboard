// Inculdes
import express from 'express';
import morgan from 'morgan';
//import mongoose from 'mongoose';
import router from './router';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import url from 'url';
import webSocket from 'ws';

// Initialize
const app = express();

// Use
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'));
app.use('/v1', router);

// Third party APIs
const CoinMarketCap = require('coinmarketcap-api');
const client = new CoinMarketCap()

// Setup our WebSocket
const server = http.createServer(app)
const wss = new webSocket.Server({ server })

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
    .catch(err => {
      console.log(err)
      ws.send(err)
    })
  }, 60000);
});

// Routes
app.get('/', function (req, res) {
	res.sendFile('index.html');
});

// app.get('/market', function(req, res) {
// 	client.getTicker({convert: 'USD'})
// 	.then(result => {
// 		res.status(200).send(result).end();
// 	})
// 	.catch(err => {
//     console.log(err)
//     res.status(400).end()
//   })
// })

// Server run
server.listen(8088, function listening() {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});

app.listen(8080, function () {
   const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});