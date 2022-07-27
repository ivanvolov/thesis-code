const fs = require("fs-extra");
const moment = require("moment");
const { parse } = require("csv-parse");
const { toCSV } = require("../providers/csvProvider");

const name = "MB_NFT_v3";

//! 20000k for mbits
const collectionSize = 20000;

(async () => {
  const data = fs.readJsonSync(name + ".json");
  const allTraits = fs.readJsonSync(name + "_Traits.json");
  console.log(Object.keys(data).length, allTraits.length);

  const result = [];
  for (const key of Object.keys(data)) {
    const i = data[key][0];
    const traits = allTraits
      .find((i) => i.token_id === key)
      .traits.filter((t) => t.trait_type != "Tattoo Motif")
      .map((t) => {
        return t.trait_count / collectionSize;
      });

    result.push({
      date: moment(i.date).format("DD-MM-yy"),
      token_id: key,
      usd_price: i.price_usd,
      avg: traits.reduce((p, c) => p + c, 0) / traits.length,
      statistic: traits.reduce((p, c) => p * c, 1),
      score: traits.reduce((p, c) => p + 1 / c, 0),
      maxTrait: traits.reduce((p, c) => Math.min(p, c), 1),
    });
  }

  await toCSV(result, "MB", [
    // "date",
    "token_id",
    "usd_price",
    "avg",
    "statistic",
    "score",
    "maxTrait",
  ]);
})();
