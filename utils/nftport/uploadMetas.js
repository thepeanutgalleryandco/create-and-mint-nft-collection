// Load modules and constants
const { RateLimit } = require('async-sema');
const fs = require("fs");
const fetch = require("node-fetch");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const readDir = (`${FOLDERS.jsonDir}`); // Change this directory to genericJSONDir if you are uploading generic images first in order to do a reveal.

const re = new RegExp("^([0-9]+).json$"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.
const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); // Ratelimit for your APIKey
const allMetadata = [];

// Grab the current date and time to create a backup directory
let date_ob = new Date();
const backupDate = date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + "_" + date_ob.getSeconds();

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

// Make a copy of the metadata.json file into the backupDate_meta directory.
fs.copyFileSync(`${readDir}/_metadata.json`, `${FOLDERS.backupJSONDir}/${backupDate}_meta/_metadata.json`);

// Main function - called asynchronously
async function main() {

  // Read the metadata.json file and parse it as a JSON
  let rawdata = fs.readFileSync(`${readDir}/_metadata.json`);
  let metaDatas = JSON.parse(rawdata);

  // Loop through each JSON object in the metadata.json file (array)
  for (const metaData of metaDatas) {
    console.log(`Starting with ${metaData.name}`);

    try {

      // Check if the object does not contain a metadata_uri field and only then proceed to attempt the upload
      if (!("metadata_uri" in metaData)) {
        try {

          // Apply rate limit that was set in the account_details.js file
          await limit()

          // Call the fetchWithRetry function that will perform the API call
          const response = await fetchWithRetry(JSON.stringify(metaData, null, 2));
          
          // Set the metadata_uri field for the object equal to the metadata_uri field from the API call.
          metaData["metadata_uri"] = `${response.metadata_uri}`;

          // Add the json object to the allMetadata array.
          allMetadata.push(JSON.stringify(response, null, 2));

          console.log(`${response.name} metadata uploaded!`);

        } catch(err) {
          console.log(`Catch: ${err}`)
        }
      } // The metadata_uri field already exists in the object
        else {
        // Add the json object to the allMetadata array.
        allMetadata.push(metaData);
        console.log(`${metaData.name} metadata already uploaded`);

      }
    } catch(err) {
      console.log(`Catch: ${err}`)
    }
  };

  // Re-write the metadata.json file with the new metadata_uri field included
  fs.writeFileSync(
    `${readDir}/_metadata.json`,
    JSON.stringify(metaDatas, null, 2)
  );
  
  // Write the allMetadata array to the ipfsMetas.json file. This file is not used anymore. It is simply there as a backup and to review.
  fs.writeFileSync(
    `${readDir}/_ipfsMetas.json`,
    '[\n' + allMetadata + '\n]'
  );

}

// Start the main process.
main();

// timer function - This function is used to add a timeout in between actions.
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// fetchWithRetry function - This function is used to perform API calls to upload metadata json files
async function fetchWithRetry(jsonMeta)  {

  return new Promise((resolve, reject) => {

    // Set maximum number of retries as defined in account_details.js file
    let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);

    // Constant that will perform an API call and return a resolve or reject
    const fetch_retry = (_jsonMeta, _numberOfRetries) => {

      // Set the API URL
      let url = "https://api.nftport.xyz/v0/metadata";

      // Setup the API details
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ACCOUNT_DETAILS.auth,
        },
        body: _jsonMeta,
      };

      // Perform the API call
      return fetch(url, options).then(async (res) => {

          // Create a variable that will contain the HTTP Status code
          const status = res.status;

          // Check the status and if 200, then move to the processing part of the object
          if(status === 200) {
            return res.json();
          } // If the status is not 200, throw an error and move to the catch block
            else {
            throw `ERROR STATUS: ${status}`;
          }
      })
      .then(async (json) => {

        // Check if the response field in the JSON packet contains "OK" and then return to the parent process with the packet and a resolve
        if(json.response === "OK"){
          return resolve(json);
        } // If the response field in the JSON packet does not contain "OK", throw an error and move to the catch block
          else {
          throw `NOK: ${json.error}`;
        }
      })

      .catch(async (error) => {
        console.error(`CATCH ERROR: ${error}`)

        // Check if there are any retry attempts left
        if (_numberOfRetries !== 0) {
          console.log(`Retrying mint`);

          // Before performing the next API call, wait for the timeout specified in the account_details.js file
          // The total number of retries gets decremented when issuing the API call again
          await timer(TIMEOUT)
          fetch_retry(_jsonMeta, _numberOfRetries - 1)

        } // If the total number of retries have been reached, then respond with a reject and finish the fetch_retry process
          else {
          console.log(`All requests unsuccessful for ${_jsonMeta}`);
          reject(error)

        }
      });
    }

    // Call the fetch_retry constant. Pass in the jsonMeta object and the total number of retries for the API call should it experience any issues.
    return fetch_retry(jsonMeta, numberOfRetries);
  });
}
