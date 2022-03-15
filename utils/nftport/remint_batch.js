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

      console.log(`Starting check of ${FOLDERS.failedMintsDir}/${file}`);

      // Set the mint filename for the JSON object
      const mintFile = `${FOLDERS.mintedDir}/${file}`;

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
            console.log(`Response: ${mintedMeta.mintData.response} , Error: ${mintedMeta.mintData.error} found, will remint ${FOLDERS.mintedDir}/${file}`);
            throw 'File not minted at all'
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
                  console.log(`${mintedMeta.mintData.transaction_external_url} was minted, but transaction was not found. Will remint ${FOLDERS.mintedDir}/${file}`);
                  throw 'File minted, but not on blockchain'
                } // Check if the HTML text contains the works 'fail or failed'
                  // Throw an error so that the JSON object can be minted again.
                  else if (text.toLowerCase().includes('</i>fail</span>') || text.toLowerCase().includes('</i>failed</span>')) {
                  console.log(`${mintedMeta.mintData.transaction_external_url} was minted, but the transaction has a failed status on the blockchain. Will remint ${FOLDERS.mintedDir}/${file}`);
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

        console.log(`Check done for ${FOLDERS.failedMintsDir}/${file}`);
        console.log(`${FOLDERS.failedMintsDir}/${file} already minted`);

      } catch (err) {

        console.log(`Check done for ${FOLDERS.failedMintsDir}/${file}`);
        console.log(`Starting re-mint process on ${FOLDERS.failedMintsDir}/${file}`);

        try {
  
          // Load the file and parse it as JSON, then grab its metaData section as that is what will need to be used to perform a remint.
          const jsonFile = JSON.parse(fs.readFileSync(`${FOLDERS.failedMintsDir}/${file}`));
          const meta_metaData = jsonFile.metaData;

          // Apply rate limit that was set in the account_details.js file
          await limit()

          // Set the mint info required for the API from the meta field and account_details.js file
          const mintInfo = {
            chain: ACCOUNT_DETAILS.chain.toLowerCase(),
            contract_address: ACCOUNT_DETAILS.contract_address,
            tokens: meta_metaData.tokens
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

          // Call the fetchWithRetry function that will perform the API call to mint the JSON object
          const mintData = await fetchWithRetry("https://api.nftport.xyz/v0/mints/customizable/batch", options)
  
          // Combine the metadata from the JSON object with the mintedData from the API call
          const combinedData = {
            metaData: meta_metaData,
            mintData: mintData
          }
  
          // Write the json files to the mintedDir and remintedDir directories.
          writeMintData(file, combinedData)
  
          // Check if the mint was successful at an API level, the Transaction could still have failed on the blockchain itself,
          // so if a transaction is not showing up, then it is best to check the transaction hash / url to determine what happened.
          // The check_mints and remint processes can also be used to attempt to mint missing transactions.
          if (mintData.response !== 'OK' || mintData.error !== null) {
            console.log(`Re-minting ${file} failed! Response: ${mintData.response} , Error: ${mintData.error}`);
          } else {
            console.log(`Re-minted: ${file}!`);
          }
  
        } catch(err) {
          console.log(`Catch: Re-minting ${file} failed with ${err}!`)
        }

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

// Constant that is used to created a json file within the remintedDir directory for every JSON object that got minted and no errors were thrown.
// It also overrides the json file in the mintedDir directory, but a backup is made before updating the file if the file exists.
const writeMintData = (_file, _data) => {
  fs.writeFileSync(`${FOLDERS.remintedDir}/${_file}`, JSON.stringify(_data, null, 2));

  if (fs.existsSync(`${FOLDERS.mintedDir}/${_file}`)) {
    fs.copyFileSync(`${FOLDERS.mintedDir}/${_file}`, `${FOLDERS.backupMintedDir}/${backupDate}/${_file}`);
  }
  
  fs.writeFileSync(`${FOLDERS.mintedDir}/${_file}`, JSON.stringify(_data, null, 2));
};
