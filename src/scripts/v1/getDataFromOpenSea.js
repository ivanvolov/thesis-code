/* tslint:disable */
const { addresses } = require("../contracts");
const { openseaTransferEventMapper } = require("./mappers");
const { getAllEvents, getCollection } = require("./providers/openSea");
const fs = require("fs-extra");
const { sleeper } = require("./utilities");

const name = "BAYC";
const contract = addresses.ape;

(async () => {
  const ids = Object.keys(fs.readJsonSync("Bored_Ape_Yacht_Club_NFT.json"));
  const slug = (await getCollection(contract)).slug;
  console.log(slug);
  const dict = {};
  for (let i of ids) {
    await sleeper(3);
    const events = await getAllEvents(contract, slug, i);
    const logs = events.map((j) => openseaTransferEventMapper(j));
    if (logs.length > 0) {
      dict[i] = logs;
      console.log("!!!!!");
    }
    console.log(i);
  }
  fs.writeJsonSync(name + "_NFT.json", dict);
  process.exit();
})();
