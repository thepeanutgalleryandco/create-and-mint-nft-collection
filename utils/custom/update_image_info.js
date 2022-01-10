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
  item.file_url = `${NFT_DETAILS.imageFilesBase}/${item.custom_fields.edition}.png`;

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

console.log(`Updated Base URI for images to ===> ${NFT_DETAILS.imageFilesBase}`);
