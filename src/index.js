const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const ticker = require('coinmarketcap-api');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const client = new CoinMarketCap()
 
client.getTicker().then(console.log).catch(console.error)
client.getGlobal().then(console.log).catch(console.error)

app.get('/', function (req, res) {
	res.sendFile('index.html');
});

app.listen(8080, function () {
  console.log('App Running');
});