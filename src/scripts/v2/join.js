/* tslint:disable */
const fs = require("fs-extra");

const name = "MB";

(async () => {
  let arr = {};

  for (let i = 0; i <= 6; i++) {
    const data = fs.readJsonSync(`${name}_${i}_tmp_NFT.json`);
    arr = { ...arr, ...data };
  }
  fs.writeJsonSync(name + "_NFT.json", arr);

  process.exit();
})();
