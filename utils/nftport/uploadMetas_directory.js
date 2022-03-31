// Load modules and constants
const { RateLimit } = require('async-sema');
const fs = require("graceful-fs");
const FormData = require("form-data");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const { fetchWithRetry } = require(`${FOLDERS.modulesDir}/fetchWithRetry.js`);

// Check if the uploadGenericMeta value in account_details.js is set to true. If it is the case read data from genericJSONDir directory, otherwise read from jsonDir directory
var readDir ;
if (ACCOUNT_DETAILS.uploadGenericMeta) {
  readDir = (`${FOLDERS.genericJSONDir}`);
} else {
  readDir = (`${FOLDERS.jsonDir}`);
}
const re = new RegExp("^([0-9]+).json$"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.
const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); // Ratelimit for your APIKey
const allMetadata = [];

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

// Make a copy of the _metadata.json file into the backupDate_meta directory.
fs.copyFileSync(`${readDir}/_metadata.json`, `${FOLDERS.backupJSONDir}/${backupDate}_meta/_metadata.json`);
console.log(`Backed up ${readDir}/_metadata.json to ${FOLDERS.backupJSONDir}/${backupDate}_meta/_metadata.json before starting process.`);

// Main function - called asynchronously
async function main() {

  console.log("Starting to load metadata of all JSON files.");
  
  // Load the list of file names from the readDir directory and sort them numerically
  const files = fs.readdirSync(readDir);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  // Create formData object
  const formData = new FormData();

  // Loop through each file in the list.
  for (const file of files) {
    
    if (re.test(file)) {

      // Add file into formData object
      const fileStream = fs.createReadStream(`${readDir}/${file}`);
      formData.append("metadata_files", fileStream);
      
    }
  }

  console.log("Done loading metadata of all JSON files.");

  try {

    // Apply rate limit that was set in the account_details.js file
    await limit()

    console.log("Starting upload of metadata.");

    // Setup the API details
    let options = {
      method: "POST",
      headers: {
        Authorization: ACCOUNT_DETAILS.auth
      },
      body: formData
    };

    // Call the fetchWithRetry function that will perform the API call
    const response = await fetchWithRetry("https://api.nftport.xyz/v0/metadata/directory", options);

    console.log("Done with upload of metadata.");

    // Loop through each file in the list.
    for (const file of files) {
    
      if (re.test(file)) {

        // Load the json file and parse it as JSON
        const jsonFile = fs.readFileSync(`${readDir}/${file}`);
        let metaData = JSON.parse(jsonFile);

        // Add response data to original metadata
        metaData.response = response.response ;
        metaData.metadata_uri = `${response.metadata_directory_ipfs_uri}${metaData.custom_fields.edition}` ;
        metaData.metadata_directory_ipfs_uri = response.metadata_directory_ipfs_uri ;
        metaData.metadata_directory_ipfs_url = response.metadata_directory_ipfs_url ;
        metaData.error = response.error ;

        // Create a new filename for a file that will be created in the ipfsMetasDir directory.
        const uploadedMeta = `${FOLDERS.ipfsMetasDir}/${metaData.custom_fields.edition}.json`;

        // Add the response JSON object to the allMetadata array.
        allMetadata.push(metaData);

        // Write the response JSON object to the ipfsMetasDir directory
        fs.writeFileSync(`${uploadedMeta}`, JSON.stringify(metaData, null, 2));
        
        // Write the allMetadata array to the ipfsMetasDir directory
        fs.writeFileSync(`${FOLDERS.ipfsMetasDir}/_ipfsMetas.json`,JSON.stringify(allMetadata, null, 2));

        console.log(`${metaData.name} metadata uploaded!`);

      }
    }

    console.log("Done with uploading and updating metadata.");

  } catch(err) {
    console.log(`Catch: ${err}`);
  }  
}

// Start the main process.
main();

// timer function - This function is used to add a timeout in between actions.
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}