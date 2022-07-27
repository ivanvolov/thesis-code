const fs = require("fs-extra");
const moment = require("moment");
const { getETHPriceDF } = require("../utilities");

const name = "MB_NFT";

(async () => {
  const ethDf = await getETHPriceDF();

  const data = fs.readJsonSync(name + ".json");
  console.log(Object.keys(data).length);

  for (const key of Object.keys(data)) {
    const ts = data[key];
    for (const i in ts) {
      ts[i] = {
        ...ts[i],
        price_usd: convertPrice(ts[i], ethDf),
      };
    }
  }
  fs.writeJSONSync(name + "_v2.json", data);
})();

const convertPrice = (ts, ethDf) => {
  if (ts.paymentToken === "ETH" || ts.paymentToken === "WETH") {
    const ethPrice = ethDf.find((p) =>
      p.time.isSame(moment(ts.date).startOf("day"), "day")
    )?.price;
    if (!ethPrice) console.log(ts);
    return (
      ethPrice * (parseFloat(ts.total_price) / 10 ** ts.paymentTokenDecimals)
    );
  } else if (ts.paymentToken === "USDC") {
    return parseFloat(ts.total_price) / 10 ** ts.paymentTokenDecimals;
  }
};

// --- prices
// https://www.cryptodatadownload.com/data/binance/
