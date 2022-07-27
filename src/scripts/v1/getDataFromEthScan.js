const api = require('etherscan-api').init('<ETHERSCAN API KEY>')

const contract = '0x41a322b28d0ff354040e2cbc676f0320d8c8850d' //addresses.meebits;
;(async () => {
  // const abi = await api.contract.getabi(contract);
  // const json = JSON.parse(abi.result);

  const txlist = await api.log.getLogs(
    contract,
    1,
    'latest',
    null,
    null,
    0x0000000000000000000000000000000000000000000000000000000000000000,
  )
  console.log(txlist)
  // fs.writeJsonSync("tx.json", txlist);
})()
