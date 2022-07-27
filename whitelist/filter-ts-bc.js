const fs = require('fs-extra');

let data = fs.readJsonSync("whitelist/res-from-alchemy.json");

console.log(data.length);
data = data.filter(i => i.rawContract.value == "0x0");
console.log(data.length);

fs.writeJSONSync("whitelist/res-from-alchemy-procecced.json", data);