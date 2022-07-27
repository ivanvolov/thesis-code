const fs = require('fs-extra')

const normalize = (val) => val.replace(/ /g, '_').replace(/,/g, '-')

;(async () => {
  let data = fs.readJsonSync('./data/MB_Traits.json')
  const dict = {}
  data.map((record) => {
    record.traits.map((j) => {
      const key1 = normalize(j.trait_type)
      if (!dict[key1]) dict[key1] = {}

      const value = j.value
      dict[key1][value] = j.trait_count
    })
  })
  fs.writeJSONSync('./data/MB_Traits_traits_v2.json', dict)

  let Traits = fs.readJsonSync('./data/MB_Traits_traits.json')

  Object.keys(Traits).map((key) => {
    Object.entries(Traits[key]).map(([key2, value]) => {
      console.log(key, key2, value)
      Traits[key][key2] = {
        score2: dict[key][key2],
        ...value,
      }
    })
  })

  fs.writeJsonSync('./data/MB_Traits_traits.json', Traits)
})()
