const fs = require('fs-extra')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

;(async () => {
  let Traits = fs.readJsonSync('./data/' + 'MB_Traits_traits.json')

  console.log(Traits.length)
  const arr = []
  Object.keys(Traits).map((i) => {
    Object.entries(Traits[i]).map((a) => {
      const value = a[1]
      arr.push({
        names: `trait_${i}_${value.num}`,
        category: i,
        value: a[0],
        score: value.score2,
      })
    })
  })

  let header = []
  for (const i of arr) {
    header.push(...Object.keys(i))
  }
  header = header.filter(onlyUnique)

  console.log(header)
  let csvWriter = createCsvWriter({
    path: `./data/MB_Traits_score.csv`,
    header: header.map((key) => ({ id: key, title: key })),
  })
  await csvWriter.writeRecords(arr)
})()

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}
