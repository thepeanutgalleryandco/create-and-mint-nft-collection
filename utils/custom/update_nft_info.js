const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { NETWORK } = require(`${FOLDERS.constantsDir}/network.js`);
const { NFT_DETAILS } = require(`${FOLDERS.constantsDir}/nft_details.js`);

const {
  network,
  solanaMetadata
} = require(`${FOLDERS.sourceDir}/config.js`);

// read json data
let rawdata = fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach((item) => {
  if (network == NETWORK.sol) {
    item.name = `${NFT_DETAILS.namePrefix} #${item.custom_fields.edition}`;
    item.description = NFT_DETAILS.description;
    item.creators = solanaMetadata.creators;
  } else {
    item.name = `${NFT_DETAILS.namePrefix} #${item.custom_fields.edition}`;
    item.description = NFT_DETAILS.description;
  }

  fs.writeFileSync(
    `${FOLDERS.jsonDir}/${item.custom_fields.edition}.json`,
    JSON.stringify(item, null, 2)
  );

  console.log(`${item.name} copied and updated!`);
});

fs.writeFileSync(
  `${FOLDERS.jsonDir}/_metadata.json`,
  JSON.stringify(data, null, 2)
);

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
