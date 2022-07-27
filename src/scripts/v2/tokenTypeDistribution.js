const fs = require("fs-extra");

const name = "MB_NFT";

(async () => {
  const data = fs.readJsonSync(name + ".json");
  console.log(Object.keys(data).length);

  const destribution = {};
  for (const key of Object.keys(data)) {
    const ts = data[key];
    for (const t of ts) {
      const key = t.paymentToken;
      if (!destribution[key]) destribution[key] = 0;
      destribution[key]++;
    }
  }
  console.log(destribution);
})();
