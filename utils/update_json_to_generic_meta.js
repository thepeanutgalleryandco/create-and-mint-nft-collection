const path = require("path");
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { NFT_DETAILS } = require(`${FOLDERS.constantsDir}/nft_details.js`);

if (!fs.existsSync(`${FOLDERS.genericJSONDir}`)) {
  fs.mkdirSync(`${FOLDERS.genericJSONDir}`);
}

// read json data
let rawdata = fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach((item) => {
  const item_name = item.name;
  item.name = `${NFT_DETAILS.genericTitle} #${item.custom_fields.edition}`;
  item.description = NFT_DETAILS.genericDescription;
  item.file_url = NFT_DETAILS.genericURL;
  delete item.attributes;
  delete item.custom_fields.dna;

  fs.writeFileSync(
    `${FOLDERS.genericJSONDir}/${item.custom_fields.edition}.json`,
    JSON.stringify(item, null, 2)
  );

  console.log(`${item_name} copied and updated!`);
});

fs.writeFileSync(
  `${FOLDERS.genericJSONDir}/_metadata.json`,
  JSON.stringify(data, null, 2)
);

console.log("Updated metadata to Generic information");
