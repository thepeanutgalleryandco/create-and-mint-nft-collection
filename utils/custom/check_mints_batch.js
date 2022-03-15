// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const re = new RegExp("^([0-9]+).json$"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.
const fetch = require('node-fetch');

let failedErrorCount = 0;
let failedTxnCount = 0;
let totalFailedCount = 0;

// Main function - called asynchronously
async function main() {

  // Check if the failedMintsDir directory exists, removes it and its contents if it does, then creates it again.
  if (fs.existsSync(`${FOLDERS.failedMintsDir}`)) {
    fs.rmSync(`${FOLDERS.failedMintsDir}`, { recursive: true });
  }
  fs.mkdirSync(`${FOLDERS.failedMintsDir}`);

  // Get a directory listing of the files in the mintedDir directory and sorts it.
  const files = fs.readdirSync(`${FOLDERS.mintedDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  // Loops through each file in the directory listing and check if the match the regular expression for json files and only if it passes the check, then
  // attempt to process the file.
  for (const file of files) {
    if (re.test(file)) {
      console.log(`Starting check of file ${file}`);
      await checkFileForFailures(file);
      console.log(`Done with file ${file}`);
    }
  }

  // Calculate the total errored files that needs to be re-minted.
  totalFailedCount = failedErrorCount + failedTxnCount;
  console.log(`Total failed error mints: ${failedErrorCount}`);
  console.log(`Total failed txn mints: ${failedTxnCount}`);
  console.log(`Total failed mints: ${totalFailedCount}`);

  // Advise the user whether a re-mint is required or not.
  if (totalFailedCount === 0) {
    console.log(`Re-Mint Process Not Needed`);
  } else {
    console.log(`Re-Mint Process Is Needed, please run the utils/nftport/remint.js script once ready.`);
  }

}

// Start the main process.
main();

// checkFileForFailures function - Takes in a file name and will check the file's minting data object to determine whether or not a re-mint is required for it.
async function checkFileForFailures(file) {
    console.log(`Starting to process file ${file}`);

    // Read the contents of the minted json file.
    const jsonFile = JSON.parse(fs.readFileSync(`${FOLDERS.mintedDir}/${file}`));

    // Check if the value of the response key is not OK or if the value of the error key is not null within the mintData object.
    if (jsonFile.mintData.response !== "OK" || jsonFile.mintData.error !== null) {
      console.log(`Error in file ${file}`);
      failedErrorCount++;

      // Write the contents of the minted json file into the failedMintsDir directory.
      fs.writeFileSync(`${FOLDERS.failedMintsDir}/${file}`, JSON.stringify(jsonFile, null, 2));
      console.log(`Adding ${file} to the failed mints directory due to error in response packet - Response: ${jsonFile.mintData.response} , Error: ${jsonFile.mintData.error}`);

    } // If the response was OK and the error was null, then check the transaction on the online explorer.
      else {

      // Prep the API call to the URL.
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Perform an API call to the URL.
      const txnCheck = await fetch(`${jsonFile.mintData.transaction_external_url}`, options)
        .then(response => {
          // Convert the response from the API call into text as it is a HTML response and not a JSON object.
          return response.text();
        })
        .then(text => {
          // Check if the HTML text contains the works 'search not found'
          if (text.toLowerCase().includes('search not found')) {
            failedTxnCount++;

            // Write the contents of the minted json file into the failedMintsDir directory.
            fs.writeFileSync(`${FOLDERS.failedMintsDir}/${file}`, JSON.stringify(jsonFile, null, 2));
            console.log(`Adding ${file} to the failed mints directory due to transaction not found on blockchain. URL - ${jsonFile.mintData.transaction_external_url}`);
          } // Check if the HTML text contains the works 'fail or failed'
            else if (text.toLowerCase().includes(`</i>fail</span>`) || text.toLowerCase().includes(`</i>failed</span>`)) {
            failedTxnCount++;

            // Write the contents of the minted json file into the failedMintsDir directory.
            fs.writeFileSync(`${FOLDERS.failedMintsDir}/${file}`, JSON.stringify(jsonFile, null, 2));
            console.log(`${file} was minted, but the transaction has a failed status on the blockchain. Will remint ${FOLDERS.mintedDir}/${file}`);
          }

          return ;
        })
        .catch(err => {
          console.error('error:' + err)
        });
    }
}
