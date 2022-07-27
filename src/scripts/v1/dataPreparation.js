const fs = require("fs-extra");
const moment = require("moment");
const { parse } = require("csv-parse");

// const name = "Meebits_NFT";
const name = "Bored_Ape_Yacht_Club_NFT";

const getPrice = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("ETH-USD.csv", (err, fileData) => {
      parse(fileData, {}, function (err, rows) {
        resolve(
          rows.slice(1).map((i) => ({
            time: moment(i[0]),
            price: parseFloat(i[4]),
          }))
        );
      });
    });
  });
};

(async () => {
  const result = [];
  let data = fs.readJsonSync(name + ".json");
  const traits = fs.readJsonSync("Traits_" + name + ".json");
  const priceDf = await getPrice();

  for (const k of Object.keys(data)) {
    const price = Math.max(
      ...data[k].map((elem) => {
        const po = priceDf.find((p) =>
          p.time.isSame(moment(elem.date).startOf("day"), "day")
        );
        return po
          ? po.price * (parseFloat(elem.total_price) / 10 ** 18)
          : undefined;
      })
    );
    result.push({
      price,
      id: k,
      traits: traits[k],
    });
  }

  fs.writeJSONSync(name + "_Normalized.json", result);
})();
