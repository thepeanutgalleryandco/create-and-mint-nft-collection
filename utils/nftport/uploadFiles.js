const { RateLimit } = require('async-sema');
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);
const FormData = require("form-data");
const fetch = require("node-fetch");
const path = require("path");

const TIMEOUT = 1000; // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const allMetadata = [];
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); //Ratelimit for your APIKey
const re = new RegExp("^([0-9]+).png"); //Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.

async function main() {
  const files = fs.readdirSync(`${FOLDERS.imagesDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  for (const file of files) {
    console.log(`Starting upload of file ${file}`);
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
    const fetch_retry = (_file) => {
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
            console.error(`ERROR STATUS: ${status}`)
            console.log('Retrying')
            await timer(TIMEOUT)
            fetch_retry(_file)
          }
      })
      .then(async (json) => {
        if(json.response === "OK"){
          return resolve(json);
        } else {
          console.error(`NOK: ${json.error}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_file)
        }
      })
      .catch(async (error) => {
        console.error(`CATCH ERROR: ${error}`)
        console.log('Retrying')
        await timer(TIMEOUT)
        fetch_retry(_file)
      });
    }
    return fetch_retry(file);
  });
}
