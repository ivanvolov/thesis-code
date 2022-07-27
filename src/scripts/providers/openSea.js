const axios = require('axios').default

const getCollection = async (asset_contract_address) => {
  const options = {
    method: 'GET',
    url: `https://api.opensea.io/api/v1/asset_contract/${asset_contract_address}`,
    headers: { 'X-API-KEY': '<API-KEY>' },
  }

  const { data } = await axios.request(options)
  return data.collection
}

const getCollectionD = async (slug) => {
  const options = {
    method: 'GET',
    url: `https://api.opensea.io/api/v1/collection/${slug}`,
    headers: { 'X-API-KEY': '<API-KEY>' },
  }

  const { data } = await axios.request(options)
  return data.collection
}

const getAsset = async (contract, id) => {
  const options = {
    method: 'GET',
    url: `https://api.opensea.io/api/v1/asset/${contract}/${id}/`,
    headers: { 'X-API-KEY': '<API-KEY>' },
  }

  const { data } = await axios.request(options)
  return data
}

const getAllEvents = async (contract, id) => {
  let all = []
  let offset = 0,
    limit = 200
  const e_type = 'successful'
  const options = {
    method: 'GET',
    url: `https://api.opensea.io/api/v1/events?asset_contract_address=${contract}&event_type=${e_type}&token_id=${id}&only_opensea=false&offset=${offset}&limit=${limit}`,
    headers: {
      'X-API-KEY': '<API-KEY>',
      Accept: 'application/json',
    },
  }

  const { data } = await axios.request(options)
  all = [...data.asset_events]

  return all
}

module.exports = {
  getAllEvents,
  getAsset,
  getCollection,
  getCollectionD,
}
