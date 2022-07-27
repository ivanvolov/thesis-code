// const opnseaEventMapper = ({
//   asset,
//   payment_token,
//   from_account,
//   event_type,
// }) => {
//   return {
//     assetId: asset.id,
//     token_id: asset.token_id,
//     num_sales: asset.num_sales,
//     payment: payment_token.symbol,
//     owner: asset.owner.address,
//     from: from_account.address,
//     type: event_type,
//   };
// };

const openseaTransferEventMapper = ({
  asset,
  transaction,
  total_price,
  winner_account,
  seller,
  event_type,
  payment_token,
}) => {
  return {
    assetId: asset.id,
    paymentToken: payment_token.symbol,
    paymentTokenDecimals: payment_token.decimals,
    token_id: asset.token_id,
    total_price: total_price,
    seller: seller.address,
    winner: winner_account.address,
    date: transaction.timestamp,
    type: event_type,
  };
};

const openseaAssetMapper = ({ token_id, id, last_sale, traits, num_sales }) => {
  if (last_sale) {
    return {
      opensea_id: id,
      token_id,
      num_sales,
      paymentToken: last_sale.payment_token.symbol,
      paymentTokenDecimals: last_sale.payment_token.decimals,
      usd_price: last_sale.payment_token.usd_price,
      total_price: last_sale.total_price,
      seller: last_sale.transaction.from_account.address,
      winner: last_sale.transaction.to_account.address,
      date: last_sale.event_timestamp,
      type: "successful",
      traits: traits.map((i) => ({
        trait_type: i.trait_type,
        value: i.value,
        trait_count: i.trait_count,
      })),
    };
  } else {
    return {
      opensea_id: id,
      token_id,
      num_sales,
      type: "successful",
      traits: traits.map((i) => ({
        trait_type: i.trait_type,
        value: i.value,
        trait_count: i.trait_count,
      })),
    };
  }
};

module.exports = {
  openseaTransferEventMapper,
  openseaAssetMapper,
  // opnseaEventMapper,
};
