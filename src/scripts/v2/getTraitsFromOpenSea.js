/* tslint:disable */
const { addresses } = require("../../contracts");
const { openseaAssetMapper } = require("../mappers");
const { getAsset } = require("../providers/openSea");
const fs = require("fs-extra");
const { sleeper } = require("../utilities");

const name = "MB_NFT_v3";
const contract = addresses.meebits;

(async () => {
  const ids = Object.keys(fs.readJsonSync(name + ".json"));
  const arr = [];

  let count = 0;
  for (let i of ids) {
    if (i > 6376) {
      await sleeper(2);
      const asset = openseaAssetMapper(await getAsset(contract, i));
      arr.push(asset);
      console.log(i);
      count++;
      if (count % 10 === 0) {
        await fs.writeJson(name + "_Traits.json", arr);
      }
    }
  }
  fs.writeJsonSync(name + "_Traits.json", arr);
  process.exit();
})();
