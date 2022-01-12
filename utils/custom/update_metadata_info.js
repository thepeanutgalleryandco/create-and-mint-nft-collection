// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { NFT_DETAILS } = require(`${FOLDERS.constantsDir}/nft_details.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

var readDir;
// Check if the uploadGenericMeta value in account_details.js is set to true. If it is the case read data from genericJSONDir directory, otherwise read from jsonDir directory
if (ACCOUNT_DETAILS.uploadGenericMeta) {
  readDir = (`${FOLDERS.genericJSONDir}`);
} else {
  readDir = (`${FOLDERS.jsonDir}`);
}

// Grab the current date and time to create a backup directory
let date_ob = new Date();
const backupDate = date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + "_" + date_ob.getSeconds();


// Check if the ipfsMetasDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.ipfsMetasDir}`)) {
  fs.mkdirSync(`${FOLDERS.ipfsMetasDir}`);
}

// Check if the backupDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupDir}`);
}

// Check if the backupJSONDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupJSONDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}`);
}

// Check if a backupDate directory already exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupJSONDir}/${backupDate}_meta`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}/${backupDate}_meta`);
}

// Load _metadata.json file and parse it as JSON
let rawdata = fs.readFileSync(`${readDir}/_metadata.json`);
let data = JSON.parse(rawdata);

// Loop through each json object in the _metadata.json file
data.forEach((item) => {

  // Update the metadata_uri value that can be updated in the nft_details.js file.
  item.metadata_uri = `${NFT_DETAILS.metaDataJSONFilesBase}/${item.custom_fields.edition}.json`;

  // Write a json file for the object edition
  fs.writeFileSync(
    `${FOLDERS.ipfsMetasDir}/${item.custom_fields.edition}.json`,
    JSON.stringify(item, null, 2)
  );

  console.log(`${item.name} copied and updated!`);
});

// Write a _ipfsMetas.json file
fs.writeFileSync(
  `${FOLDERS.ipfsMetasDir}/_ipfsMetas.json`,
  JSON.stringify(data, null, 2)
);

console.log(`Updated Base URI for metadata JSON to ===> ${NFT_DETAILS.metaDataJSONFilesBase} and created ipfsMetas folder and json data files`);
