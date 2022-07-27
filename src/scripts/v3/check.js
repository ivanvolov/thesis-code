const fs = require('fs-extra')

const name = 'MB_Traits'

;(async () => {
  const data = fs.readJsonSync('./data/' + name + '.json')

  const token_id_Dict = {}
  for (const i in data) {
    const token_id = Number(data[i].token_id)
    console.log(token_id)
    if (!token_id_Dict[token_id]) token_id_Dict[token_id] = 0
    token_id_Dict[token_id]++
  }

  console.log(Object.values(token_id_Dict).sort((a, b) => b - a))
})()
