import CoinMarketCap from 'coinmarketcap-api';
const client = new CoinMarketCap()

export const index = (req, res, next) => {
	client.getTicker({convert: 'USD'})
    .then(results => {
      res.json(results).status(200).end()
    })
    .catch(err => {
      console.log(err)
    })
};