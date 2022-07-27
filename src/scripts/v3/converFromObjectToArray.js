const fs = require('fs-extra')

const name = 'Ds'

;(async () => {
  const data = fs.readJsonSync('./data/' + name + '.json')
  const Traits = fs.readJsonSync('./data/' + 'Traits.json')
  const arr = []

  for (const k of Object.keys(data)) {
    arr.push(...data[k])
  }

  arr.map((i) => {
    const { traits } = Traits.find((trait) => trait.token_id == i.token_id)
    i.traits = traits
  })

  await fs.writeJSONSync(name + '/data/MB_Traits.json', arr)
})()
