const { RateLimit } = require('async-sema');
const fetch = require("node-fetch");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const TIMEOUT = 2000; // Milliseconds. This a timeout for errors only. If there is an error, it will wait then try again. 5000 = 5 seconds.
const reMintedArray = [];
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); //Ratelimit for your APIKey
const re = new RegExp("^([0-9]+).json"); //Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.

let date_ob = new Date();
const backupDate = date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + "_" + date_ob.getSeconds();

if (fs.existsSync(`${FOLDERS.remintedDir}`)) {
  fs.rmSync(`${FOLDERS.remintedDir}`, { recursive: true });
}
fs.mkdirSync(`${FOLDERS.remintedDir}`);

if (!fs.existsSync(`${FOLDERS.backupDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupDir}`);
}

if (!fs.existsSync(`${FOLDERS.backupMintedDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupMintedDir}`);
}

if (!fs.existsSync(`${FOLDERS.backupMintedDir}/${backupDate}`)) {
  fs.mkdirSync(`${FOLDERS.backupMintedDir}/${backupDate}`);
}

async function main() {

  const files = fs.readdirSync(`${FOLDERS.failedMintsDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  for (const file of files) {
    if (re.test(file)) {
      try {
        console.log(`Starting re-mint process on ${FOLDERS.failedMintsDir}/${file}`);
        const jsonFile = JSON.parse(fs.readFileSync(`${FOLDERS.failedMintsDir}/${file}`));
        const meta_metaData = jsonFile.metaData;

        await limit()
        let mintData = await fetchWithRetry(meta_metaData)
        console.log(`Re-Minted: ${meta_metaData.name}`);
        const combinedData = {
          metaData: meta_metaData,
          mintData: mintData
        }
        reMintedArray.push(combinedData);
        writeMintData(meta_metaData.custom_fields.edition, combinedData, reMintedArray)
      } catch(err) {
        console.log(err)
      }
    }
  }
}

main();

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(meta) {
  return new Promise((resolve, reject) => {
    const fetch_retry = (_meta) => {
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
          console.error(`ERROR STATUS: ${status}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_meta)
        }
      })
      .then(async (json) => {
        if(json.response === "OK"){
          return resolve(json);
        } else {
          console.error(`NOK: ${json.error}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_meta)
        }
      })
      .catch(async (error) => {
        console.error(`CATCH ERROR: ${error}`)
        console.log('Retrying')
        await timer(TIMEOUT)
        fetch_retry(_meta)
      });
    }
    return fetch_retry(meta);
  });
}

const writeMintData = (_edition, _data, _reMintedArray) => {
  fs.writeFileSync(`${FOLDERS.remintedDir}/_reminted.json`, JSON.stringify(_reMintedArray, null, 2));
  fs.writeFileSync(`${FOLDERS.remintedDir}/${_edition}.json`, JSON.stringify(_data, null, 2));
  fs.copyFileSync(`${FOLDERS.mintedDir}/${_edition}.json`, `${FOLDERS.backupMintedDir}/${backupDate}/${_edition}.json`);
  fs.writeFileSync(`${FOLDERS.mintedDir}/${_edition}.json`, JSON.stringify(_data, null, 2));
};
