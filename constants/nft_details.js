const NFT_DETAILS = {
  description: "YOUR_DESCRIPTION_HERE", // Description that will be added to each of your NFTs
  namePrefix: "YOUR_NAME_PREFIX_HERE", // Name prefix that will be added for each of your NFTs. Ex. Steaks #1, Steaks #2
  imageFilesBase: "ipfs://ADD_IPFS_IMAGE_CID_HERE", // Pinned IPFS CID when making use of a service like Pinata. Ex. QmP12prm2rp1omr1Ap2orm1oprm12FQWFQOFOGdnasnsda
  metaDataJSONFilesBase: "ipfs://ADD_IPFS_META_DATA_CID_HERE", // Pinned IPFS CID when making use of a service like Pinata. Ex. QmP12prm2rp1omr1Ap2orm1oprm12FQWFQOFOGdnasnsda
  blankFilenameInLayers: true, // This value is a boolean with a value of false or true. If true, then any layer items where the image name is blank, then it will skip that layer when adding metadata information. When set to false, then the information will be added to the metadata.
  genericTitle: "Unknown", // Replace with what you want the generic titles to say. Only change if you are planning on using NFT reveal.
  genericDescription: "Unknown", // Replace with what you want the generic descriptions to say. Only change if you are planning on using NFT reveal.
  genericURL: "https://ipfs.io/ipfs/QmX6GnNspTEUUCzv1woUGT83jXC3fYZ4SuMxeoSGZQF9sA/logo.gif" // Replace with the image URL that your generic NFTs should show. Only change if you are planning on using NFT reveal.
};

module.exports = {
  NFT_DETAILS
};
