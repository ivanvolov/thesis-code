/* tslint:disable */
const { addresses, sizes } = require("../../contracts");
const { openseaTransferEventMapper } = require("../mappers");
const { getAllEvents } = require("../providers/openSea");
const fs = require("fs-extra");
const { sleeper } = require("../utilities");

const name = "MB_6";
const contract = addresses.meebits;
const collectionSize = sizes.meebits;

(async () => {
  const dict = {};
  for (let i = 7820; i < collectionSize; i++) {
    await sleeper(2);
    const events = await getAllEvents(contract, i);
    const logs = events.map((j) => openseaTransferEventMapper(j));
    if (logs.length > 0) {
      dict[i] = logs;
      console.log("!!!!!");
    }
    console.log(i);
    if (i % 10 === 0) {
      await fs.writeJson(name + "_tmp_NFT.json", dict);
    }
  }
  fs.writeJsonSync(name + "_NFT.json", dict);
  process.exit();
})();
