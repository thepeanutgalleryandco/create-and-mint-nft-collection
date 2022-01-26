// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { NFT_DETAILS } = require(`${FOLDERS.constantsDir}/nft_details.js`);

// Load _metadata.json file and parse it as JSON
let rawdata = fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`);
let data = JSON.parse(rawdata);

// Loop through each json object in the _metadata.json file
data.forEach((item) => {

  // Update the file_url and image values that can be updated in the nft_details.js file.
  item.file_url = `${NFT_DETAILS.imageFilesBase}/${item.custom_fields.edition}.png`;
  item.image = `${NFT_DETAILS.imageFilesBase}/${item.custom_fields.edition}.png`;

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

console.log(`Updated Base URI for images to ===> ${NFT_DETAILS.imageFilesBase}`);
