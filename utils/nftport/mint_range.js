const { RateLimit } = require('async-sema');
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const readDir = (`${FOLDERS.jsonDir}`); // Change this directory to genericJSONDir if you are uploading generic images first in order to do a reveal.

const TIMEOUT = 1000; // Milliseconds. This a timeout for errors only. If there is an error, it will wait then try again. 5000 = 5 seconds.
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); //Ratelimit for your APIKey
const mintedArray = [];
const mintingRange = [];

if (!fs.existsSync(`${FOLDERS.mintedDir}`)) {
  fs.mkdirSync(`${FOLDERS.mintedDir}`);
}

for (let x = Number(ACCOUNT_DETAILS.mint_range[0]); x < Number(ACCOUNT_DETAILS.mint_range[1])+1; x++)  {
  mintingRange.push(x);
}

async function main() {
  const metaData = JSON.parse(
    fs.readFileSync(`${readDir}/_metadata.json`)
  );

  for (const meta of metaData) {
    console.log(`Starting with ${meta.custom_fields.edition}`);

    if (mintingRange.includes(meta.custom_fields.edition)) {
      console.log(`Starting check of ${meta.name}.json object`);
      const mintFile = `${FOLDERS.mintedDir}/${meta.custom_fields.edition}.json`;

      try {
        fs.accessSync(mintFile);
        const mintedFile = fs.readFileSync(mintFile)

        if(mintedFile.length > 0) {
          const mintedMeta = JSON.parse(mintedFile)

          if(mintedMeta.mintData.response !== "OK" || mintedMeta.mintData.error !== null) {
            console.log(`Response: ${mintedMeta.mintData.response} , Error: ${mintedMeta.mintData.error} found, will remint ${FOLDERS.mintedDir}/${meta.custom_fields.edition}.json`);
            throw 'Edition not minted at all'
          } else {
            let options = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            };

            let txnCheck = await fetch(`${mintedMeta.mintData.transaction_external_url}`, options)
              .then(response => {
                return response.text();
              })
              .then(text => {
                if (text.toLowerCase().includes('search not found')) {
                  console.log(`${mintedMeta.mintData.transaction_external_url} was minted, but transaction was not found at ${mintedMeta.mintData.transaction_external_url}. Will remint ${FOLDERS.mintedDir}/${meta.custom_fields.edition}.json`);
                  throw 'Edition minted, but not on blockchain'
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
        mintedArray.push(JSON.stringify(meta, null, 2));
        fs.writeFileSync(`${FOLDERS.mintedDir}/_minted.json`, '[\n' + mintedArray + '\n]');
        console.log(`${meta.name} already minted`);
      } catch(err) {
        console.log(`Check done for ${meta.name}.json object.`);
        console.log(`Starting mint of ${meta.name}.json object`);

        try {
          await limit()
          let mintData = await fetchWithRetry(meta);
          const combinedData = {
            metaData: meta,
            mintData: mintData
          }
          mintedArray.push(JSON.stringify(combinedData, null, 2));

          fs.writeFileSync(`${FOLDERS.mintedDir}/_minted.json`, '[\n' + mintedArray + '\n]');
          writeMintData(`${meta.custom_fields.edition}`, combinedData)
          console.log(`Minted: ${meta.name}!`);
        } catch(err) {
          console.log(`Catch: ${err}`)
        }
      }
    }

    console.log(`Done with ${meta.custom_fields.edition}`);
  }
}

main();

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(meta) {
  return new Promise((resolve, reject) => {
    let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);

    const fetch_retry = (_meta, _numberOfRetries) => {
      let url = "https://api.nftport.xyz/v0/mints/customizable";

      const mintInfo = {
        chain: ACCOUNT_DETAILS.chain,
        contract_address: ACCOUNT_DETAILS.contract_address,
        metadata_uri: _meta.metadata_uri,
        mint_to_address: ACCOUNT_DETAILS.mint_to_address,
        token_id: _meta.custom_fields.edition,
      };

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ACCOUNT_DETAILS.auth,
        },
        body: JSON.stringify(mintInfo),
      };

      return fetch(url, options).then(async (res) => {
        const status = res.status;

        if(status === 200) {
          return res.json();
        }
        else {
          throw `ERROR STATUS: ${status}`;
        }
      })
      .then(async (json) => {
        if(json.response === "OK"){
          return resolve(json);
        } else {
          throw `NOK: ${json.error}`;
        }
      })
      .catch(async (error) => {
        console.error(`CATCH ERROR: ${error}`)

        if (_numberOfRetries !== 0) {
          console.log(`Retrying mint`);
          await timer(TIMEOUT)
          fetch_retry(_meta, _numberOfRetries - 1)
        } else {
          console.log(`All requests unsuccessful for ${_meta.custom_fields.edition}`);
          reject(error)
        }
      });
    }
    return fetch_retry(meta, numberOfRetries);
  });
}

const writeMintData = (_edition, _data) => {
  fs.writeFileSync(`${FOLDERS.mintedDir}/${_edition}.json`, JSON.stringify(_data, null, 2));
};
