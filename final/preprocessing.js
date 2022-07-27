const fs = require('fs-extra')
const moment = require('moment')
const { getETHPriceDF } = require('../src/scripts/utilities')

const name = 'MB_Traits'

;(async () => {
  //?Whitelist
  let _whitelist = fs.readJsonSync('whitelist/res-from-alchemy-procecced3.json')
  const Whitelist = {}
  _whitelist.map((i) => {
    if (!Whitelist[i.from]) Whitelist[i.from] = 0
    Whitelist[i.from]++
  })

  const ethDf = await getETHPriceDF()

  let data = fs.readJsonSync(name + '.json')
  data = data.sort((a, b) => new Date(a.date) - new Date(b.date))

  const traitsDict = fs.readJsonSync(name + '_traits.json')
  const token_id_Dict = {}

  const network = constractNetwork()

  for (const i in data) {
    const token_id = Number(data[i].token_id)

    data[i] = {
      price_in_usd: convertPrice(data[i], ethDf),
      cur_to_usd_price: getUSDPrice(data[i], ethDf),
      ...data[i],
    }

    let score_rating = 0
    for (const j in data[i].traits) {
      const trait = data[i].traits[j]
      if ('Tattoo Motif' == trait.trait_type) continue
      const key = `trait_${trait.trait_type}`.replace(/ /g, '_')

      //? character dummies
      // data[i][key] = trait.value.replace(/ /g, "_").replace(/,/g, "-");

      //? reverse_weighted
      const reverse_weighted = 1 / (trait.trait_count / 20000)

      //? score
      // const value = traitsDict[trait.trait_type.replace(/ /g, "_")][trait.value].num+1;

      //? cintiniouse dummies
      const value =
        traitsDict[trait.trait_type.replace(/ /g, '_')][trait.value].num + 1

      data[i][key] = value
      score_rating += reverse_weighted
    }
    delete data[i]['usd_price']
    delete data[i]['traits']
    data[i].score_rating = score_rating

    const first_transaction = Number(!token_id_Dict[token_id])
    data[i].first_transaction = first_transaction

    if (!first_transaction) {
      data[i].prev_price = token_id_Dict[token_id].prev_price
      data[i].cur_increased =
        (100 *
          (data[i].cur_to_usd_price - token_id_Dict[token_id].prev_price)) /
        token_id_Dict[token_id].prev_price
      data[i].time_from_prev =
        new Date(data[i].date) - token_id_Dict[token_id].prev_time
    }

    data[i].whitelisted = Whitelist[data[i].seller] ? 1 : 0
    if (Whitelist[data[i].seller])
      data[i].whitelisted_count = Whitelist[data[i].seller]

    data[i].winner_total_sold = network[data[i].winner].seller
    data[i].winner_total_bought = network[data[i].winner].buyer

    if (!token_id_Dict[token_id]) token_id_Dict[token_id] = { count: 0 }
    token_id_Dict[token_id].count++
    token_id_Dict[token_id].prev_price = data[i].price_in_usd
    token_id_Dict[token_id].prev_cur = data[i].cur_to_usd_price
    token_id_Dict[token_id].prev_time = new Date(data[i].date)
  }

  fs.writeJSONSync('final/' + name + '_processed.json', data)
})()

const constractNetwork = () => {
  let df = fs.readJsonSync('./data/MB_Traits.json')

  df = df
    .map((i) => ({
      id: i.token_id,
      from: i.seller,
      to: i.winner,
    }))
    .filter((i) => i.from && i.to)

  let nodes = {}
  df.forEach((i) => {
    if (!nodes[i.from]) nodes[i.from] = { count: 0, seller: 0, buyer: 0 }
    if (!nodes[i.to]) nodes[i.to] = { count: 0, seller: 0, buyer: 0 }

    nodes[i.from].count++
    nodes[i.from].seller++

    nodes[i.to].count++
    nodes[i.to].buyer++
  })

  return nodes
}

const convertPrice = (ts, ethDf) => {
  if (ts.paymentToken === 'ETH' || ts.paymentToken === 'WETH') {
    const ethPrice = ethDf.find((p) =>
      p.time.isSame(moment(ts.date).startOf('day'), 'day'),
    )?.price
    if (!ethPrice) console.log('Price not found:', ts)
    return (
      ethPrice * (parseFloat(ts.total_price) / 10 ** ts.paymentTokenDecimals)
    )
  } else if (ts.paymentToken === 'USDC') {
    return parseFloat(ts.total_price) / 10 ** ts.paymentTokenDecimals
  }
}

const getUSDPrice = (ts, ethDf) => {
  if (ts.paymentToken === 'ETH' || ts.paymentToken === 'WETH') {
    const ethPrice = ethDf.find((p) =>
      p.time.isSame(moment(ts.date).startOf('day'), 'day'),
    )?.price
    if (!ethPrice) console.log('Price not found:', ts)
    return ethPrice
  } else if (ts.paymentToken === 'USDC') {
    return 1
  }
}
