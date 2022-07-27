const fs = require("fs-extra");
const moment = require("moment");
const { objectKeyToCsv } = require("../providers/csvProvider");

const name = "MB_NFT_v2";

(async () => {
  const data = fs.readJsonSync(name + ".json");
  console.log(Object.keys(data).length);

  const destribution = {};
  const maxDestribution = {};
  const maxPointDestribution = {};
  for (const key of Object.keys(data)) {
    const ts = data[key];
    let prev = 0;

    let maxTs = { price_usd: 0 };

    for (const t of ts) {
      const day = moment(t.date).startOf("day").format("DD-MM-yy");

      if (t.price_usd > maxTs.price_usd) {
        maxTs = t;
      }

      if (t.price_usd > prev) {
        prev = t.price_usd;
        if (!maxDestribution[day]) maxDestribution[day] = 0;
        maxDestribution[day]++;
      }

      if (!destribution[day]) destribution[day] = 0;
      destribution[day]++;
    }
    const day = moment(maxTs.date).startOf("day").format("DD-MM-yy");
    if (!maxPointDestribution[day]) maxPointDestribution[day] = 0;
    maxPointDestribution[day]++;
  }
  const diffDestribution = { ...destribution };
  for (const key of Object.keys(diffDestribution)) {
    diffDestribution[key] -= maxDestribution[key];
  }

  await objectKeyToCsv(destribution, "tx_dist_" + name);
  // await objectKeyToCsv(maxDestribution, "max_tx_dist_" + name);
  // await objectKeyToCsv(diffDestribution, "diff_tx_dist_" + name);
  // await objectKeyToCsv(maxPointDestribution, "max_point_tx_dist_" + name);
})();
