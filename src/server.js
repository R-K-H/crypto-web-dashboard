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

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    console.log('tick')
    client.getTicker({convert: 'USD'})
    .then(result => {
      ws.send(JSON.stringify(result));
      ws.ping('', false, true);
    })
    .catch(err => {
      console.log(err)
      ws.send(err)
    })
    ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 60000);

// Routes
app.get('/', function (req, res) {
	res.sendFile('index.html');
});

// Server run
server.listen(8088, function listening() {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});

app.listen(8080, function () {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});