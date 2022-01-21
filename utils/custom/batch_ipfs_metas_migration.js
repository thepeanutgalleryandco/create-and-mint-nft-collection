// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const re = new RegExp("^([0-9]+).json$"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.

let allBatchIPFSMetas = [];
let currentBatchIPFSMetas = [];
let batchIPFSMetasArrayCount = 0;
let currentBatchNFTCount = 0;
let totalBatchNFTCount = 0;


// Main function - called asynchronously
async function main() {

  // Check if the ipfsMetasDir directory exists and if not, then create it.
  if (!fs.existsSync(`${FOLDERS.ipfsMetasDir}`)) {
    console.error(`The ${FOLDERS.ipfsMetasDir} directory does not exsit. Please make sure that the metadata files have been uploaded and an ${FOLDERS.ipfsMetasDir} directory exists.`);
    process.exit(1);
  }

  // Check if the batchIPFSMetasDir directory exists, removes it and its contents if it does, then creates it again.
  if (fs.existsSync(`${FOLDERS.batchIPFSMetasDir}`)) {
      fs.rmSync(`${FOLDERS.batchIPFSMetasDir}`, { recursive: true });
    }
    fs.mkdirSync(`${FOLDERS.batchIPFSMetasDir}`);

  // Get a directory listing of the files in the ipfsMetasDir directory and sorts it.
  const files = fs.readdirSync(`${FOLDERS.ipfsMetasDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  // Loops through each file in the directory listing and check if the match the regular expression for json files and only if it passes the check, then
  // attempt to process the file.
  for (const file of files) {
    if (re.test(file)) {
      
      console.log(`Starting addition of file ${file}`);

      // Increment the total number of NFTs added to the batch file.
      currentBatchNFTCount++;
      totalBatchNFTCount++;

      // Read the contents of the ipfsMetasDir json file.
      const ipfsJSONFile = JSON.parse(fs.readFileSync(`${FOLDERS.ipfsMetasDir}/${file}`));

      // Create the token JSON Object for the ipfs JSON file in the format of batch processing
      const ipfsMetaObject =  {
        mint_to_address: ACCOUNT_DETAILS.mint_to_address,
        token_id: String(ipfsJSONFile.custom_fields.edition),
        metadata_uri : ipfsJSONFile.metadata_uri,
        quantity: ACCOUNT_DETAILS.batch_mint_nft_amount
      };

      // Add the token JSON object into the batch array.
      currentBatchIPFSMetas.push(ipfsMetaObject);

      // Check if the batch size for an array has been reached.
      if (totalBatchNFTCount % ACCOUNT_DETAILS.batch_mint_size === 0 ) {

        // Reset the current batch counter to start a new batch
        currentBatchNFTCount = 0;

        // Create the batch JSON object
        const batchIPFSMetaObject = {
          tokens: currentBatchIPFSMetas
        };

        // Reset the array batch array
        // Increment the batch file counter
        // Add the batch JSON object into the all batches array
        currentBatchIPFSMetas = [];
        batchIPFSMetasArrayCount++ ;
        allBatchIPFSMetas.push(batchIPFSMetaObject);

        // Write a new batchNumber.json file as well as a _batchIPFSMetas.json file that will contain all batch number json files.
        fs.writeFileSync(`${FOLDERS.batchIPFSMetasDir}/${batchIPFSMetasArrayCount}.json`, JSON.stringify(batchIPFSMetaObject, null, 2));
        fs.writeFileSync(`${FOLDERS.batchIPFSMetasDir}/_batchIPFSMetas.json`, JSON.stringify(allBatchIPFSMetas, null, 2));

      }

      console.log(`Done with addition of file ${file}`);
    }
  }

  // Check if there are any left over items that needs to be written to a batch file
  if (currentBatchNFTCount !== 0) {

    // Create the batch JSON object
    const batchIPFSMetaObject = {
      tokens: currentBatchIPFSMetas
    };

    // Increment the batch file counter
    // Add the batch JSON object into the all batches array
    batchIPFSMetasArrayCount++ ;
    allBatchIPFSMetas.push(batchIPFSMetaObject);

    // Write a new batchNumber.json file as well as a _batchIPFSMetas.json file that will contain all batch number json files.
    fs.writeFileSync(`${FOLDERS.batchIPFSMetasDir}/${batchIPFSMetasArrayCount}.json`, JSON.stringify(batchIPFSMetaObject, null, 2));
    fs.writeFileSync(`${FOLDERS.batchIPFSMetasDir}/_batchIPFSMetas.json`, JSON.stringify(allBatchIPFSMetas, null, 2));

  }

  console.log(`Total of ${totalBatchNFTCount} NFTs moved into ${batchIPFSMetasArrayCount} batch files in batchIPFSMetas directory`);

}

// Start the main process.
main();