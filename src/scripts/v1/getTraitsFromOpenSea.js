/* tslint:disable */

const { addresses } = require("../contracts");
const { getAsset } = require("./providers/openSea");
const fs = require("fs-extra");

const dsName = "Bored_Ape_Yacht_Club_NFT";
const contract = addresses.ape; //!

(async () => {
  // const dict = {};
  // const data = fs.readJsonSync(`${dsName}.json`);
  // for (const id of Object.keys(data)) {
  //   const { traits } = await getAsset(contract, id);
  //   dict[id] = traits;
  //   console.log(id);
  // }
  // fs.writeJsonSync(`${dsName}_Traits.json`, dict);
  // process.exit();
  const asset = await getAsset(contract, 3200);
  fs.writeJsonSync(`tmp.json`, asset);
  console.log(asset);
})();
