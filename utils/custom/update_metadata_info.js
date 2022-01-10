const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { NETWORK } = require(`${FOLDERS.constantsDir}/network.js`);
const { NFT_DETAILS } = require(`${FOLDERS.constantsDir}/nft_details.js`);

const {
  network,
  solanaMetadata,
} = require(`${FOLDERS.sourceDir}/config.js`);

// read json data
let rawdata = fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach((item) => {
  item.metadata_uri = `${NFT_DETAILS.metaDataJSONFilesBase}/${item.custom_fields.edition}.json`;

  fs.writeFileSync(
    `${FOLDERS.jsonDir}/${item.custom_fields.edition}.json`,
    JSON.stringify(item, null, 2)
  );

  console.log(`${item.name} copied and updated!`);
});

fs.writeFileSync(
  `${FOLDERS.jsonDir}/_ipfsMetas.json`,
  JSON.stringify(data, null, 2)
);

console.log(`Updated Base URI for metadata JSON to ===> ${NFT_DETAILS.metaDataJSONFilesBase}`);
