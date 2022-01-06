// All values needs to be in single quotes
const ACCOUNT_DETAILS = {
  auth: 'YOUR_NFTPORT_API_KEY_HERE', // Add your APIKey here that the NFTPort team will provide. Ex. orm1or1-efe1-112a-cccd-kqwfkfmk
  contract_address: 'YOUR_CONTRACT_ADDRESS_HERE', // Add your contract address here, not your transaction hash. After creating a contract on NFTPort, retrieve the contract address via the APIs. Ex. 0xfe81c4cdb8b21753ebe117c84als2d6588e150ff
  mint_to_address: 'YOUR_WALLET_ADDRESS_HERE', // Add your wallet address here that will be the owner of the minted NFTs. Ex. 0x5cE5D823f4bD8Ec610293fBa65832B479152C7E1
  chain: 'CHAIN_TO_MINT_TO', // Add the chain where the NFTs will be minted to here. At the time of writing, "polygon" and "rinkeby" are possible values.
  max_rate_limit: '1', // Update your ratelimit linked to your APIKey / account from NFTPort. This is a numeric field. Ex. '1'
  mint_range: ['y','z'], // Add your min (y) and max (z) values in here and all NFTs in this range will be minted and these values are inclusive. Ex. '5','10'
  mint_item: 'w', // Add your NFT edition number in here and this specific NFT will be minted. Ex. '3'
  numberOfRetries: 'v', // Add your API retry count here so that your NFTPort APIs can attempt a retry if unsuccessful at first.  Ex. '3'
  timeout: 'u' // Milliseconds. This a timeout for errors only. If there is an error, it will wait then try again. 5000 = 5 seconds.
};

module.exports = {
  ACCOUNT_DETAILS
};
