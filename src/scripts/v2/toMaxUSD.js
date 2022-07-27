const fs = require("fs-extra");
const moment = require("moment");
const { objectKeyToCsv } = require("../providers/csvProvider");

const name = "MB_NFT_v2";

(async () => {
  const data = fs.readJsonSync(name + ".json");
  console.log(Object.keys(data).length);

  for (const key of Object.keys(data)) {
    let maxTs = { price_usd: 0 };

    for (const t of data[key]) {
      if (t.price_usd > maxTs.price_usd) {
        maxTs = t;
      }
    }
    if (maxTs.price_usd !== data[key][0].price_usd) {
      data[key] = [maxTs];
    } else {
      delete data[key];
    }
  }

  console.log(Object.keys(data).length);
  fs.writeJSONSync(name + "_v4.json", data);
})();
