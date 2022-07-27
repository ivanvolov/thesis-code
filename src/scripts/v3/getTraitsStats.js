const fs = require('fs-extra')
const name = 'MB_Traits'

;(async () => {
  const data = fs.readJsonSync('./data/' + name + '.json')

  const traits = {}
  for (const i of data) {
    for (const trait of i.traits) {
      if ('Tattoo Motif' == trait.trait_type) continue
      const key = trait.trait_type.replace(/ /g, '_')
      if (!traits[key]) traits[key] = {}

      traits[key][trait.value] = 1 / (trait.trait_count / 20000)
    }
  }

  for (const k of Object.keys(traits)) {
    const arr = Object.entries(traits[k])
      .sort((a, b) => {
        if (a[1] < b[1]) return -1
        if (a[1] > b[1]) return 1
        return 0
      })
      .map((value, index) => [value[0], { score: value[1], num: index }])
    traits[k] = Object.fromEntries(arr)
  }
  fs.writeJSONSync('./data/' + name + '_traits.json', traits)
})()
