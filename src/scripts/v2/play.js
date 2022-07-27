const fs = require("fs-extra");
const moment = require("moment");

const name = "MB_NFT_v3_Traits";

const traitsDist = async () => {
  const data = fs.readJsonSync(name + ".json");
  console.log(data.length);

  const dest = {};
  for (const i of data) {
    const trait = i.traits;
    trait.forEach((t) => {
      let key = t.trait_type;
      if (!dest[key]) dest[key] = {};

      let key2 = t.value;
      if (!dest[key][key2]) dest[key][key2] = t.trait_count;
      // dest[key][key2]++;
    });
  }
  console.log(Object.keys(dest["Tattoo Motif"]).length);

  await fs.writeJson("tmp.json", dest);
};

const transAmounDist = () => {
  const data = fs.readJsonSync(name + ".json");
  console.log(Object.keys(data).length);

  let max = 0;
  const dest = {};
  for (const key of Object.keys(data)) {
    const ts = data[key];
    max = Math.max(ts.length);
    if (!dest[ts.length]) dest[ts.length] = 0;
    dest[ts.length]++;
  }
  console.log(max, dest);
};

(async () => {
  traitsDist();
})();
