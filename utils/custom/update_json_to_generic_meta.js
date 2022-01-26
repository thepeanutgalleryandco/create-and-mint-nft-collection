// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { NFT_DETAILS } = require(`${FOLDERS.constantsDir}/nft_details.js`);

// Check if the genericJSONDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.genericJSONDir}`)) {
  fs.mkdirSync(`${FOLDERS.genericJSONDir}`);
}

// Load _metadata.json file and parse it as JSON
let rawdata = fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`);
let data = JSON.parse(rawdata);

// Loop through each json object in the _metadata.json file
data.forEach((item) => {

  // Set the item's current name for logging
  const item_name = item.name;

  // Update the item's name, description and URL to the generic fields in the nft_details.js file
  item.name = `${NFT_DETAILS.genericTitle} #${item.custom_fields.edition}`;
  item.description = NFT_DETAILS.genericDescription;
  item.file_url = NFT_DETAILS.genericURL;
  item.image = NFT_DETAILS.genericURL;

  // Remove the attributes and dna fiels from the json object
  delete item.attributes;
  delete item.custom_fields.dna;

  // Write a json file for the object edition
  fs.writeFileSync(
    `${FOLDERS.genericJSONDir}/${item.custom_fields.edition}.json`,
    JSON.stringify(item, null, 2)
  );

  console.log(`${item_name} copied and updated!`);
});

// Write a _metadata.json file
fs.writeFileSync(
  `${FOLDERS.genericJSONDir}/_metadata.json`,
  JSON.stringify(data, null, 2)
);

console.log("Updated metadata to Generic information and saved it under the genericJSON folder");
