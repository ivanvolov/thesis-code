const fs = require("fs-extra");
const moment = require("moment");
const { objectKeyToCsv } = require("./providers/csvProvider");

// const name = "Meebits_NFT";
const name = "Bored_Ape_Yacht_Club_NFT";

(async () => {
  const data = fs.readJsonSync(name + ".json");
  console.log(Object.keys(data).length);

  const destribution = {};
  for (const key of Object.keys(data)) {
    const ts = data[key];
    for (const t of ts) {
      const day = moment(t.date).startOf("day").format("DD-MM-yy");
      if (!destribution[day]) destribution[day] = 0;
      destribution[day]++;
    }
  }
  await objectKeyToCsv(destribution, "destribution_" + name);
})();
