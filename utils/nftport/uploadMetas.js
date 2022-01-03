const { RateLimit } = require('async-sema');
const fs = require("fs");
const fetch = require("node-fetch");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const readDir = (`${FOLDERS.jsonDir}`); // Change this directory to genericJSONDir if you are uploading generic images first in order to do a reveal.

const re = new RegExp("^([0-9]+).json$"); //Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.
const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); //Ratelimit for your APIKey
const allMetadata = [];
let date_ob = new Date();
const backupDate = date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + "_" + date_ob.getSeconds();

if (!fs.existsSync(`${FOLDERS.backupDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupDir}`);
}

if (!fs.existsSync(`${FOLDERS.backupJSONDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}`);
}

if (!fs.existsSync(`${FOLDERS.backupJSONDir}/${backupDate}_meta`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}/${backupDate}_meta`);
}
fs.copyFileSync(`${readDir}/_metadata.json`, `${FOLDERS.backupJSONDir}/${backupDate}_meta/_metadata.json`);

async function main() {

  // read json data
  let rawdata = fs.readFileSync(`${readDir}/_metadata.json`);
  let metaDatas = JSON.parse(rawdata);

  for (const metaData of metaDatas) {
    console.log(`Starting with ${metaData.name}`);

    try {
      if (!("metadata_uri" in metaData)) {
        try {
          await limit()
          const response = await fetchWithRetry(JSON.stringify(metaData, null, 2));
          metaData["metadata_uri"] = `${response.metadata_uri}`;
          allMetadata.push(JSON.stringify(response, null, 2));
          console.log(`${response.name} metadata uploaded!`);
        } catch(err) {
          console.log(`Catch: ${err}`)
        }
      } else {
        allMetadata.push(metaData);
        console.log(`${metaData.name} metadata already uploaded`);
      }
    } catch(err) {
      console.log(`Catch: ${err}`)
    }
  };

  fs.writeFileSync(
    `${readDir}/_metadata.json`,
    JSON.stringify(metaDatas, null, 2)
  );

  fs.writeFileSync(
    `${readDir}/_ipfsMetas.json`,
    '[\n' + allMetadata + '\n]'
  );

}

main();

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(jsonMeta)  {

  return new Promise((resolve, reject) => {
    let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);

    const fetch_retry = (_jsonMeta, _numberOfRetries) => {
      let url = "https://api.nftport.xyz/v0/metadata";
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ACCOUNT_DETAILS.auth,
        },
        body: _jsonMeta,
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
          fetch_retry(_jsonMeta, _numberOfRetries - 1)
        } else {
          console.log(`All requests unsuccessful for ${_jsonMeta}`);
          reject(error)
        }
      });
    }

    return fetch_retry(jsonMeta, numberOfRetries);
  });
}
