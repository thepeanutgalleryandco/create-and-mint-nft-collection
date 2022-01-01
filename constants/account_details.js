const ACCOUNT_DETAILS = {
  auth: '[YOUR_NFTPORT_API_KEY_HERE]', //Add your APIKey here that the NFTPort team will provide. Ex. orm1or1-efe1-112a-cccd-kqwfkfmk
  contract_address: '[YOUR_CONTRACT_ADDRESS_HERE]', //Add your contract address here, not your transaction hash. After creating a contract on NFTPort, retrieve the contract address via the APIs. Ex. 0xfe81c4cdb8b21753ebe117c846652d6588e150ff
  mint_to_address: '[YOUR_WALLET_ADDRESS_HERE]', //Add your wallet address here that will be the owner of the minted NFTs. Ex. 0x5cE5D823f4bD8Ec610868fBa65832B479152C7E1
  chain: '[CHAIN_TO_MINT_TO]', //Add the chain where the NFTs will be minted to here. At the time of writing, "polygon" and "rinkeby" are possible values.
  max_rate_limit: x //Add your rate limit linked to your APIKey / account from NFTPort. This is a numeric field, so should be without quotes. Ex. 2
};

module.exports = {
  ACCOUNT_DETAILS
};
