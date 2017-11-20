import CoinMarketCap from 'coinmarketcap-api';
import Currency from './../models/currency';
const client = new CoinMarketCap()

export const index = (req, res, next) => {
  client.getTicker({convert: 'USD'})
    .then(results => {
      for (var i in results){
        saveCurrency(results[i]);
      }
      res.json(results).status(200).end()
    })
    .catch(err => {
      console.log(err)
    })

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
          });
        }
      });
    }
};