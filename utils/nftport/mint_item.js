// Load modules and constants
const { RateLimit } = require('async-sema');
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const readDir = (`${FOLDERS.jsonDir}`); // Change this directory to genericJSONDir if you are uploading generic images first in order to do a reveal.

const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); // Ratelimit for your APIKey
const mintedArray = [];

// Check if the mintedDir directory exists, if it does not exist then create it.
if (!fs.existsSync(`${FOLDERS.mintedDir}`)) {
  fs.mkdirSync(`${FOLDERS.mintedDir}`);
}

// Main function - called asynchronously
async function main() {

  // Load metadata.json file
  const metaData = JSON.parse(
    fs.readFileSync(`${readDir}/_metadata.json`)
  );

  // Loop through each JSON object within the JSON array of the metadata.json file
  for (const meta of metaData) {
    console.log(`Starting with ${meta.custom_fields.edition}`);

    // Check if the the edition of the json object matches the edition of the edtion being minted from the account_details.js file and only if it matches
    // then continue processing the object, otherwise skip it.
    if (meta.custom_fields.edition === Number(ACCOUNT_DETAILS.mint_item)) {
      console.log(`Starting check of ${meta.name}.json object`);

      // Set the minted filename for the JSON object
      const mintFile = `${FOLDERS.mintedDir}/${meta.custom_fields.edition}.json`;

      try {
        // Load the minted filename
        fs.accessSync(mintFile);
        const mintedFile = fs.readFileSync(mintFile)

        // If the file exists and contains data then continue processing
        if(mintedFile.length > 0) {

          // Attempt to parse the data as a JSON object
          const mintedMeta = JSON.parse(mintedFile)

          // Check if the value of the response key is not OK or if the value of the error key is not null within the mintData object.
          // Throw an error so that the JSON object can be minted again.
          if(mintedMeta.mintData.response !== "OK" || mintedMeta.mintData.error !== null) {
            console.log(`Response: ${mintedMeta.mintData.response} , Error: ${mintedMeta.mintData.error} found, will remint ${FOLDERS.mintedDir}/${meta.custom_fields.edition}.json`);
            throw 'Edition not minted at all'
          } // If the response was OK and the error was null, then check the transaction on the online explorer.
            else {

            // Prep the API call to the URL.
            let options = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            };

            // Perform an API call to check the transaction on the blockchain.
            let txnCheck = await fetch(`${mintedMeta.mintData.transaction_external_url}`, options)
              .then(response => {
                // Convert the response from the API call into text as it is a HTML response and not a JSON object.
                return response.text();
              })
              .then(text => {
                // Check if the HTML text contains the works 'search not found'
                // Throw an error so that the JSON object can be minted again.
                if (text.toLowerCase().includes('search not found')) {
                  console.log(`${mintedMeta.mintData.transaction_external_url} was minted, but transaction was not found at ${mintedMeta.mintData.transaction_external_url}. Will remint ${FOLDERS.mintedDir}/${meta.custom_fields.edition}.json`);
                  throw 'Edition minted, but not on blockchain'
                } // Check if the HTML text contains the works 'fail or failed'
                  // Throw an error so that the JSON object can be minted again.
                  else if (text.toLowerCase().includes('</i>fail</span>') || text.toLowerCase().includes('</i>failed</span>')) {
                  console.log(`${mintedMeta.mintData.transaction_external_url} was minted, but the transaction has a failed status on the blockchain. Will remint ${FOLDERS.mintedDir}/${meta.custom_fields.edition}.json`);
                  throw 'Edition minted, but is in a failed status on the blockchain'
                }

                return ;
              })
              .catch(err => {
                console.error('error:' + err)
                throw err;
            });
          }
        }

        console.log(`Check done for ${meta.name}.json object.`);

        // Add the JSON object to a JSON array of minted items and write it to a minted.json file in the mintedDir directory.
        mintedArray.push(JSON.stringify(meta, null, 2));
        fs.writeFileSync(`${FOLDERS.mintedDir}/_minted.json`, '[\n' + mintedArray + '\n]');
        console.log(`${meta.name} already minted`);

      } // Should any of the above checks in the try block throw an error, then the JSON object that threw the error will be minted again
        catch(err) {
        console.log(`Check done for ${meta.name}.json object.`);
        console.log(`Starting mint of ${meta.name}.json object`);

        try {
          // Apply rate limit that was set in the account_details.js file
          await limit()

          // Call the fetchWithRetry function that will perform the API call to mint the JSON object
          let mintData = await fetchWithRetry(meta);

          // Combine the metadata from the JSON object with the mintedData from the API call
          const combinedData = {
            metaData: meta,
            mintData: mintData
          }

          // Add the combined JSON object to a JSON array of minted items and write it to a minted.json file in the mintedDir directory.
          mintedArray.push(JSON.stringify(combinedData, null, 2));
          fs.writeFileSync(`${FOLDERS.mintedDir}/_minted.json`, '[\n' + mintedArray + '\n]');
          writeMintData(`${meta.custom_fields.edition}`, combinedData)

          // Check if the mint was successful at an API level, the Transaction could still have failed on the blockchain itself,
          // so if a transaction is not showing up, then it is best to check the transaction hash / url to determine what happened.
          // The check_mints and remint processes can also be used to attempt to mint missing transactions.
          if (mintData.response !== 'OK' || mintData.error !== null) {
            console.log(`Minting ${meta.name} failed! Response: ${mintData.response} , Error: ${mintData.error}`);
          } else {
            console.log(`Minted: ${meta.name}!`);
          }

        } catch(err) {
          console.log(`Catch: Minting ${meta.name} failed with ${err}!`)
        }
      }
    }

    console.log(`Done with ${meta.custom_fields.edition}`);
  }
}

// Start the main process.
main();

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

// Constant that is used to created a json file within the mintedDir directory for every JSON object that got minted and no errors were thrown.
const writeMintData = (_edition, _data) => {
  fs.writeFileSync(`${FOLDERS.mintedDir}/${_edition}.json`, JSON.stringify(_data, null, 2));
};
