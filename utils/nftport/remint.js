// Load modules and constants
const { RateLimit } = require('async-sema');
const fetch = require("node-fetch");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const reMintedArray = [];
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); // Ratelimit for your APIKey
const re = new RegExp("^([0-9]+).json"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated. E.x. 1.json

let date_ob = new Date();
const backupDate = date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + "_" + date_ob.getSeconds();

// Check if the remintedDir directory exists, if it does exist then remove it and recreate it.
if (fs.existsSync(`${FOLDERS.remintedDir}`)) {
  fs.rmSync(`${FOLDERS.remintedDir}`, { recursive: true });
}
fs.mkdirSync(`${FOLDERS.remintedDir}`);

// Check if the backupDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupDir}`);
}

// Check if the backupMintedDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupMintedDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupMintedDir}`);
}

// Check if a backupDate directory already exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupMintedDir}/${backupDate}`)) {
  fs.mkdirSync(`${FOLDERS.backupMintedDir}/${backupDate}`);
}

// Start the main process.
main();

// Main function - called asynchronously
async function main() {

  // Load the list of file names from the failedMintsDir directory and sort them numerically
  const files = fs.readdirSync(`${FOLDERS.failedMintsDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  // Loop through each file in the list.
  for (const file of files) {

    // Check if the file name matches the regular expresion specified in the constants list at the top of the file, otherwise skip the file.
    if (re.test(file)) {
      try {
        console.log(`Starting re-mint process on ${FOLDERS.failedMintsDir}/${file}`);

        // Load the file and parse it as JSON, then grab its metaData section as that is what will need to be used to perform a remint.
        const jsonFile = JSON.parse(fs.readFileSync(`${FOLDERS.failedMintsDir}/${file}`));
        const meta_metaData = jsonFile.metaData;

        // Apply rate limit that was set in the account_details.js file
        await limit()

        // Call the fetchWithRetry function that will perform the API call to mint the JSON object
        let mintData = await fetchWithRetry(meta_metaData)

        // Combine the metadata from the JSON object with the mintedData from the API call
        const combinedData = {
          metaData: meta_metaData,
          mintData: mintData
        }

        // Add the combined JSON object to a JSON array of minted items and write it to a minted.json file in the mintedDir directory.
        reMintedArray.push(combinedData);
        writeMintData(meta_metaData.custom_fields.edition, combinedData, reMintedArray)

        // Check if the mint was successful at an API level, the Transaction could still have failed on the blockchain itself,
        // so if a transaction is not showing up, then it is best to check the transaction hash / url to determine what happened.
        // The check_mints and remint processes can also be used to attempt to mint missing transactions.
        if (mintData.response !== 'OK' || mintData.error !== null) {
          console.log(`Re-minting ${meta_metaData.name} failed! Response: ${mintData.response} , Error: ${mintData.error}`);
        } else {
          console.log(`Re-minted: ${meta_metaData.name}!`);
        }

      } catch(err) {
        console.log(`Catch: Re-minting ${file} failed with ${err}!`)
      }
    }
  }
}

// timer function - This function is used to add a timeout in between actions.
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// fetchWithRetry function - This function is used to perform API calls to mint data
async function fetchWithRetry(meta) {
  return new Promise((resolve, reject) => {

    // Set maximum number of retries as defined in account_details.js file
    let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);

    // Constant that will perform an API call and return a resolve or reject
    const fetch_retry = (_meta, _numberOfRetries) => {

      // Set the mint API URL
      let url = "https://api.nftport.xyz/v0/mints/customizable";

      // Set the mint info required for the API from the meta field and account_details.js file
      const mintInfo = {
        chain: ACCOUNT_DETAILS.chain,
        contract_address: ACCOUNT_DETAILS.contract_address,
        metadata_uri: _meta.metadata_uri,
        mint_to_address: ACCOUNT_DETAILS.mint_to_address,
        token_id: _meta.custom_fields.edition,
      };

      // Setup the API details
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ACCOUNT_DETAILS.auth,
        },
        body: JSON.stringify(mintInfo),
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
          fetch_retry(_meta, _numberOfRetries - 1)

        } // If the total number of retries have been reached, then respond with a reject and finish the fetch_retry process
          else {
          console.log(`All requests unsuccessful for ${_meta.custom_fields.edition}`);
          reject(error)

        }
      });
    }

    // Call the fetch_retry constant. Pass in the meta JSON object and the total number of retries for the API call should it experience any issues.
    return fetch_retry(meta, numberOfRetries);
  });
}

// Constant that is used to created a json file within the remintedDir directory for every JSON object that got minted and no errors were thrown.
// It also overrides the json file in the mintedDir directory, but a backup is made before updating the file.
const writeMintData = (_edition, _data, _reMintedArray) => {
  fs.writeFileSync(`${FOLDERS.remintedDir}/_reminted.json`, JSON.stringify(_reMintedArray, null, 2));
  fs.writeFileSync(`${FOLDERS.remintedDir}/${_edition}.json`, JSON.stringify(_data, null, 2));
  fs.copyFileSync(`${FOLDERS.mintedDir}/${_edition}.json`, `${FOLDERS.backupMintedDir}/${backupDate}/${_edition}.json`);
  fs.writeFileSync(`${FOLDERS.mintedDir}/${_edition}.json`, JSON.stringify(_data, null, 2));
};
