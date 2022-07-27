const fs = require("fs-extra");
const moment = require("moment");
const { parse } = require("csv-parse");

// const name = "Meebits_NFT";
const name = "Bored_Ape_Yacht_Club_NFT";

const collectionSize = 10000;
(async () => {
  let data = fs.readJsonSync(name + "_Normalized.json");

  data = data.map((i) => {
    const traits = i.traits.map((t) => {
      // return t./collectionSize//!
    });
    return {
      avg: traits.reduce((p, c) => p + c, 0) / traits.length,
      statistic: traits.reduce((p, c) => p * c, 1),
      score: traits.reduce((p, c) => p + 1 / c, 0),
    };
  });

  console.log(data[0]);
})();
