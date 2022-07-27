const fs = require('fs-extra')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const name = 'MB_Traits_processed'

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

;(async () => {
  const data = fs.readJsonSync('final/' + name + '.json')

  let header = []
  for (const i of data) {
    header.push(...Object.keys(i))
  }
  header = header.filter(onlyUnique)

  console.log(header)
  let csvWriter = createCsvWriter({
    path: `./data/MB_Traits_processed_continouse&sum.csv`,
    header: header.map((key) => ({ id: key, title: key })),
  })
  // console.log(data);
  await csvWriter.writeRecords(data)
})()
