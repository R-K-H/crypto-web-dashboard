// Inculdes
import express from 'express';
import morgan from 'morgan';
import router from './router';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import url from 'url';
import webSocket from 'ws';
import Currency from './models/currency';

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

// Define our Schema

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
      for (var i in result) {
        saveCurrency(result[i]);
      }
      ws.send(JSON.stringify(result))
    })
    .catch(err => {
      console.log(err)
      ws.send(err)
    })
  }, 60000);
});

function saveCurrency(currency) {
    Currency.find({id: currency.id}).sort({last_updated : -1}).limit(1).exec(function(err, curr){
        if (curr.length == 0 || (curr.length > 0 && curr[0].price_usd != currency.price_usd)) {
            var curr_save = new Currency({
                id: currency.id,
                name: currency.name,
                symbol: currency.symbol,
                rank: currency.rank,
                price_usd: currency.price_usd,
                price_btc: currency.price_btc,
                '24h_volume_usd': currency['24h_volume_usd'],
                market_cap_usd: currency.market_cap_usd,
                available_supply: currency.available_supply,
                total_supply: currency.total_supply,
                percent_change_1h: currency.percent_change_1h,
                percent_change_24h: currency.percent_change_24h,
                percent_change_7d: currency.percent_change_7d,
                last_updated: currency.last_updated
            });
            curr_save.save(function (err, saved_curr) {
                if (err) return console.error(err);

                return console.log('saved new entry for ' + saved_curr.name)
            });
        }
    });
}

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