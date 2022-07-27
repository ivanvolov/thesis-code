const axios = require('axios')
const fs = require('fs-extra')

const apiKey = '<ALCHEMY API KEY>'
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`
const axiosURL = `${baseURL}`

;(async () => {
  let pageKey
  let all = []
  do {
    let _data = {
      jsonrpc: '2.0',
      id: 0,
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          toBlock: '0x' + (12393673).toString(16),
          fromBlock: '0x' + (12358264).toString(16),
          toAddress: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7',
          excludeZeroValue: false,
          category: ['external', 'token', 'erc20', 'erc721', 'erc1155'],
          withMetadata: true,
        },
      ],
    }
    if (pageKey) _data.params[0].pageKey = pageKey

    const requestOptions = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(_data),
    }

    const { data } = await axios(axiosURL, requestOptions)
    // console.log(data.result.transfers[0]);
    pageKey = data.result.pageKey
    console.log(data.result.transfers.length)
    all.push(...data.result.transfers)

    await delay(3000)
    // break;
  } while (pageKey)

  fs.writeJSONSync('whitelist/res-from-alchemy.json', all)
})()

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
