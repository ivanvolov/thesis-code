const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function objectKeyToCsv(obj, name) {
  let csvWriter = createCsvWriter({
    path: `meta/${name}.csv`,
    header: [
      { id: "key", title: "key" },
      { id: "value", title: "value" },
    ],
  });
  const data = Object.keys(obj).map((k) => ({ key: k, value: obj[k] }));
  console.log(data);
  await csvWriter.writeRecords(data);
}

async function toCSV(obj, name, header) {
  let csvWriter = createCsvWriter({
    path: `meta/${name}.csv`,
    header: header.map((i) => ({ id: i, title: i })),
  });
  await csvWriter.writeRecords(obj);
}

module.exports = { objectKeyToCsv, toCSV };
