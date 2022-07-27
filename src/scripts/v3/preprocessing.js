const fs = require('fs-extra')
const moment = require('moment')
const { getETHPriceDF } = require('../utilities')

// const name = "MB_Traits_processed";
const name = 'MB_Traits'

;(async () => {
  const ethDf = await getETHPriceDF()

  let data = fs.readJsonSync('./data/' + name + '.json')

  data = data.sort((a, b) => new Date(a.date) - new Date(b.date))

  // console.log(data.filter(a => a.token_id == "14615"));
  // process.exit(0);

  const traitsDict = fs.readJsonSync('./data/' + name + '_traits.json')
  // console.log(traitsDict);

  const token_id_Dict = {}
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
      // console.log(first_transaction);
      // console.log(data[i].token_id);

      data[i].prev_price = token_id_Dict[token_id].prev_price
      data[i].time_from_prev =
        new Date(data[i].date) - token_id_Dict[token_id].prev_time
    }

    if (!token_id_Dict[token_id]) token_id_Dict[token_id] = { count: 0 }
    token_id_Dict[token_id].count++
    token_id_Dict[token_id].prev_price = data[i].price_in_usd
    token_id_Dict[token_id].prev_time = new Date(data[i].date)
  }

  // console.log(Object.values(token_id_Dict).sort((a, b) => b - a));
  fs.writeJSONSync('./data/' + name + '_processed.json', data)
})()

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

// --- prices
// https://www.cryptodatadownload.com/data/binance/
