// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);

// Grab the current date and time to create a backup directory
let date_ob = new Date();
const backupDate = date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + "_" + date_ob.getSeconds();

// Check if backupDir directory already exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupDir}`);
}

// Check if backupJSONDir directory already exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupJSONDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}`);
}

// Check if a backupDate directory already exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupJSONDir}/${backupDate}`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}/${backupDate}`);
}

// Make a copy of the metadata.json and ipfsMetas.json files into the backupDate directory.
fs.copyFileSync(`${FOLDERS.jsonDir}/_metadata.json`, `${FOLDERS.backupJSONDir}/${backupDate}/_metadata.json`);
fs.copyFileSync(`${FOLDERS.jsonDir}/_ipfsMetas.json`, `${FOLDERS.backupJSONDir}/${backupDate}/_ipfsMetas.json`);

// read metadata.json file contents
let rawdataMetaDataFile = fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`);
let dataMetaDataFile = JSON.parse(rawdataMetaDataFile);

// read ipfsMetas.json file contents
let rawdataIPFSMetaDataFile = fs.readFileSync(`${FOLDERS.jsonDir}/_ipfsMetas.json`);
let dataIPFSMetaDataFile = JSON.parse(rawdataIPFSMetaDataFile);

// Loop through every json object in the metadata.json file
dataMetaDataFile.forEach((dataMetaDataitem) => {

  try {
    // Loop through every json object in the ipfsMetas.json file and filter for the edition number of the current loop from the json object in the metadata.json
    // file. Assign the value to the filtered object's metadata_uri to the metadata.json file's metadata_uri field.
    dataMetaDataitem.metadata_uri = dataIPFSMetaDataFile.filter(function(dataIPFSitem){
      return dataIPFSitem.custom_fields.edition == dataMetaDataitem.custom_fields.edition;
    })[0]['metadata_uri'] ;

    console.log(`${dataMetaDataitem.name} copied and updated!`);
  } catch (error) {
    console.log(`Catch: ${error}`) ;
    console.log(`metadata_uri could not be updated for ${dataMetaDataitem.name}`) ;
  }

});

// Write out a new metadata.json file that will contain the metadata_uri field as well.
fs.writeFileSync(
  `${FOLDERS.jsonDir}/_metadata.json`,
  JSON.stringify(dataMetaDataFile, null, 2)
);

console.log('Updated metadata_uri fields from _ipfsMetas.json to metadata.json file');
