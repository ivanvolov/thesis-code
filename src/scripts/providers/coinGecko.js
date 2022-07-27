const CoinGecko = require("coingecko-api");

const CoinGeckoClient = new CoinGecko();

console.log(_coinList);

const geETHtPrice = async (asset_contract_address) => {
  let data = await CoinGeckoClient.exchanges.fetchTickers("bitfinex", {
    coin_ids: ["bitcoin"],
  });
  var _coinList = {};
  var _datacc = data.data.tickers.filter((t) => t.target == "USD");
  ["BTC"].forEach((i) => {
    var _temp = _datacc.filter((t) => t.base == i);
    var _res = _temp.length == 0 ? [] : _temp[0];
    _coinList[i] = _res.last;
  });
};

module.exports = {
  geETHtPrice,
};
