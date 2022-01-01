const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const re = new RegExp("^([0-9]+).json$"); //Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.

let failedErrorCount = 0;
let failedTxnCount = 0;
let totalFailedCount = 0;

async function main() {

  if (fs.existsSync(`${FOLDERS.failedMintsDir}`)) {
    fs.rmSync(`${FOLDERS.failedMintsDir}`, { recursive: true });
  }
  fs.mkdirSync(`${FOLDERS.failedMintsDir}`);

  const files = fs.readdirSync(`${FOLDERS.mintedDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  for (const file of files) {
    if (re.test(file)) {
      console.log(`Starting check of file ${file}`);
      await checkFileForFailures(file);
    }
  }

  totalFailedCount = failedErrorCount + failedTxnCount;
  console.log(`Total failed error mints: ${failedErrorCount}`);
  console.log(`Total failed txn mints: ${failedTxnCount}`);
  console.log(`Total failed mints: ${totalFailedCount}`);

  if (totalFailedCount === 0) {
    console.log(`Re-Mint Process Not Needed`);
  } else {
    console.log(`Re-Mint Process Is Needed, please backup your ${FOLDERS.mintedDir} directory and run the utils/nftport/nftport_remint.js or utils/nftport/external_remint.js`);
  }

}

main();

async function checkFileForFailures(file) {
    console.log(`Starting to process file ${file}`);
    const jsonFile = JSON.parse(fs.readFileSync(`${FOLDERS.mintedDir}/${file}`));

    if (jsonFile.mintData.response !== "OK" || jsonFile.mintData.error !== null) {
      console.log(`Error in file ${file}`);
      failedErrorCount++;
      fs.writeFileSync(`${FOLDERS.failedMintsDir}/${jsonFile.metaData.custom_fields.edition}.json`, JSON.stringify(jsonFile, null, 2));
      console.log(`Adding #${jsonFile.metaData.custom_fields.edition} to the failed mints directory due to error in response packet - Response: ${jsonFile.mintData.response} , Error: ${jsonFile.mintData.error}`);
    } else {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let txnCheck = await fetch(`${jsonFile.mintData.transaction_external_url}`, options)
        .then(response => {
          return response.text();
        })
        .then(text => {
          if (text.toLowerCase().includes('search not found')) {
            failedTxnCount++;
            fs.writeFileSync(`${FOLDERS.failedMintsDir}/${jsonFile.metaData.custom_fields.edition}.json`, JSON.stringify(jsonFile, null, 2));
            console.log(`Adding #${jsonFile.metaData.custom_fields.edition} - ${jsonFile.metaData.name} to the failed mints directory due to transaction not found on blockchain. URL - ${jsonFile.mintData.transaction_external_url}`);
          }

          return ;
        })
        .catch(err => {
          console.error('error:' + err)
        });
    }
}

const writeCheckedMintData = (_edition, _data) => {
  fs.writeFileSync(`${FOLDERS.failedMintsDir}/${_edition}.json`, _data);
};
