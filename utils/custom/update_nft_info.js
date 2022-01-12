// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { NETWORK } = require(`${FOLDERS.constantsDir}/network.js`);
const { NFT_DETAILS } = require(`${FOLDERS.constantsDir}/nft_details.js`);

const {
  network,
  solanaMetadata
} = require(`${FOLDERS.sourceDir}/config.js`);

// Load _metadata.json file and parse it as JSON
let rawdata = fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`);
let data = JSON.parse(rawdata);

// Loop through each json object in the _metadata.json file
data.forEach((item) => {

  // Check the network and update specific items, depending on the network
  // Update the name and description to the values that can be updated in the nft_details.js file.
  if (network == NETWORK.sol) {
    item.name = `${NFT_DETAILS.namePrefix} #${item.custom_fields.edition}`;
    item.description = NFT_DETAILS.description;
    item.creators = solanaMetadata.creators;
  } else {
    item.name = `${NFT_DETAILS.namePrefix} #${item.custom_fields.edition}`;
    item.description = NFT_DETAILS.description;
  }

  // Write the updated json file for the object edition
  fs.writeFileSync(
    `${FOLDERS.jsonDir}/${item.custom_fields.edition}.json`,
    JSON.stringify(item, null, 2)
  );

  console.log(`${item.name} copied and updated!`);
});

// Write the updated _metadata.json file
fs.writeFileSync(
  `${FOLDERS.jsonDir}/_metadata.json`,
  JSON.stringify(data, null, 2)
);

// Check the network and add logging to the terminal
if (network == NETWORK.sol) {
  console.log(`Updated description for images to ===> ${NFT_DETAILS.description}`);
  console.log(`Updated name prefix for images to ===> ${NFT_DETAILS.namePrefix}`);
  console.log(
    `Updated creators for images to ===> ${JSON.stringify(
      solanaMetadata.creators
    )}`
  );
} else {
  console.log(`Updated description for images to ===> ${NFT_DETAILS.description}`);
  console.log(`Updated name prefix for images to ===> ${NFT_DETAILS.namePrefix}`);
}
