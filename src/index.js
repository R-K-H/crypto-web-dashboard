const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const CoinMarketCap = require('coinmarketcap-api');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const client = new CoinMarketCap()
 
client.getGlobal().then(console.log).catch(console.error)

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

app.listen(8080, function () {
  console.log('App Running');
});