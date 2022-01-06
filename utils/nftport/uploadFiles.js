const { RateLimit } = require('async-sema');
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const FormData = require("form-data");
const fetch = require("node-fetch");
const path = require("path");

const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const allMetadata = [];
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); // Ratelimit for your APIKey
const re = new RegExp("^([0-9]+).png"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.

async function main() {
  const files = fs.readdirSync(`${FOLDERS.imagesDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  for (const file of files) {
    console.log(`Starting upload of file ${file}`);

    try {
      if (re.test(file)) {
        const fileName = path.parse(file).name;
        let jsonFile = fs.readFileSync(`${FOLDERS.jsonDir}/${fileName}.json`);
        let metaData = JSON.parse(jsonFile);

        if(!metaData.file_url.includes('https://')) {
          await limit()
          const response = await fetchWithRetry(file);
          metaData.file_url = response.ipfs_url;

          fs.writeFileSync(
            `${FOLDERS.jsonDir}/${fileName}.json`,
            JSON.stringify(metaData, null, 2)
          );
          console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
        } else {
          console.log(`${fileName} already uploaded.`);
        }

        allMetadata.push(metaData);
      }
    } catch(err) {
      console.log(`Catch: ${err}`)
    }
  }

  fs.writeFileSync(
    `${FOLDERS.jsonDir}/_metadata.json`,
    JSON.stringify(allMetadata, null, 2)
  );
}

main();

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(file) {

  return new Promise((resolve, reject) => {
    let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);

    const fetch_retry = (_file, _numberOfRetries) => {
      const formData = new FormData();
      const fileStream = fs.createReadStream(`${FOLDERS.imagesDir}/${file}`);
      formData.append("file", fileStream);

      let url = "https://api.nftport.xyz/v0/files";
      let options = {
        method: "POST",
        headers: {
          Authorization: ACCOUNT_DETAILS.auth,
        },
        body: formData,
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
          fetch_retry(_file, _numberOfRetries - 1)
        } else {
          console.log(`All requests unsuccessful for ${FOLDERS.imagesDir}/${file}`);
          reject(error)
        }
      });
    }
    return fetch_retry(file, numberOfRetries);
  });
}
