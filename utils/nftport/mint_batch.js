// Load modules and constants
const { RateLimit } = require('async-sema');
const fs = require("fs");

const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const { fetchWithRetry } = require(`${FOLDERS.modulesDir}/fetchWithRetry.js`);
const fetch = require('node-fetch');

const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); // Ratelimit for your APIKey

let batchCounter = 0 ;

// Check if the mintedDir directory exists, if it does not exist then create it.
if (!fs.existsSync(`${FOLDERS.mintedDir}`)) {
  fs.mkdirSync(`${FOLDERS.mintedDir}`);
}

// Main function - called asynchronously
async function main() {

  // Load _batchIPFSMetas.json file and parse it as JSON
  const batchIPFSMetas = JSON.parse(
    fs.readFileSync(`${FOLDERS.batchIPFSMetasDir}/_batchIPFSMetas.json`)
  );

  // Loop through each JSON object within the JSON array of the _batchIPFSMetas.json file
  for (const meta of batchIPFSMetas) {

    // Increment batch counter to know which file to process.
    batchCounter++;

    console.log(`Starting check of ${batchCounter}.json object`);

    // Set the minted filename for the JSON object
    const mintFile = `${FOLDERS.mintedDir}/${batchCounter}.json`;

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
        if(mintedMeta.mintData.response !== "OK") {
          console.log(`Response: ${mintedMeta.mintData.response} , Error: ${mintedMeta.mintData.error} found, will remint ${FOLDERS.mintedDir}/${batchCounter}.json`);
          throw 'File not minted at all'
        } // If the response was OK and the error was null, then check the transaction on the online explorer.
          else {

          // Prep the API call to the URL.
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          };

          // Perform an API call to check the transaction on the blockchain.
          const txnCheck = await fetch(`${mintedMeta.mintData.transaction_external_url}`, options)
            .then(response => {
              // Convert the response from the API call into text as it is a HTML response and not a JSON object.
              return response.text();
            })
            .then(text => {
              // Check if the HTML text contains the works 'search not found'
              // Throw an error so that the JSON object can be minted again.
              if (text.toLowerCase().includes('search not found')) {
                console.log(`${mintedMeta.mintData.transaction_external_url} was minted, but transaction was not found. Will remint ${FOLDERS.mintedDir}/${batchCounter}.json`);
                throw 'File minted, but not on blockchain'
              } // Check if the HTML text contains the works 'fail or failed'
                // Throw an error so that the JSON object can be minted again.
                else if (text.toLowerCase().includes('</i>fail</span>') || text.toLowerCase().includes('</i>failed</span>')) {
                console.log(`${mintedMeta.mintData.transaction_external_url} was minted, but the transaction has a failed status on the blockchain. Will remint ${FOLDERS.mintedDir}/${batchCounter}.json`);
                throw 'File minted, but is in a failed status on the blockchain'
              }

              return ;
            })
            .catch(err => {
              console.error('error:' + err)
              throw err;
          });
        }
      }

      console.log(`Check done for ${batchCounter}.json object.`);
      console.log(`${batchCounter} already minted`);

    } // Should any of the above checks in the try block throw an error, then the JSON object that threw the error will be minted again
      catch(err) {
      console.log(`Check done for ${batchCounter}.json object.`);
      console.log(`Starting mint of ${batchCounter}.json object`);

      try {
        // Apply rate limit that was set in the account_details.js file
        await limit()

        // Set the mint info required for the API from the meta field and account_details.js file
        const mintInfo = {
          chain: ACCOUNT_DETAILS.chain.toLowerCase(),
          contract_address: ACCOUNT_DETAILS.contract_address,
          tokens: meta.tokens
        };

        // Setup the API details
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ACCOUNT_DETAILS.auth,
          },
          body: JSON.stringify(mintInfo),
        } ;

        // Call the fetchWithRetry function that will perform the API call to mint the JSON object
        const mintData = await fetchWithRetry("https://api.nftport.xyz/v0/mints/customizable/batch", options);

        // Combine the metadata from the JSON object with the mintedData from the API call
        const combinedData = {
          metaData: meta,
          mintData: mintData
        }

        // Write a json file containing the minted data to the mintedDir directory
        writeMintData(`${batchCounter}`, combinedData)

        // Check if the mint was successful at an API level, the Transaction could still have failed on the blockchain itself,
        // so if a transaction is not showing up, then it is best to check the transaction hash / url to determine what happened.
        // The check_mints and remint processes can also be used to attempt to mint missing transactions.
        if (mintData.response !== 'OK') {
          console.log(`Minting ${batchCounter}.json failed! Response: ${mintData.response} , Error: ${mintData.error}`);
        } else {
          console.log(`Minted: ${batchCounter}.json!`);
        }

      } catch(err) {
        console.log(`Catch: Minting ${batchCounter}.json failed with ${err}!`)
      }
    }
  }
}

// Start the main process.
main();

// timer function - This function is used to add a timeout in between actions.
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// Constant that is used to created a json file within the mintedDir directory for every JSON object that got minted and no errors were thrown.
const writeMintData = (_file, _data) => {
  fs.writeFileSync(`${FOLDERS.mintedDir}/${_file}.json`, JSON.stringify(_data, null, 2));
};
