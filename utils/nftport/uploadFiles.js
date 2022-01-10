// Load modules and constants
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

// Grab the current date and time to create a backup directory
let date_ob = new Date();
const backupDate = date_ob.getFullYear() + "_" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "_" + ("0" + date_ob.getDate()).slice(-2) + "_" + date_ob.getHours() + "_" + date_ob.getMinutes() + "_" + date_ob.getSeconds();

// Check if the backupDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupDir}`);
}

// Check if the backupJSONDir directory exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupJSONDir}`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}`);
}

// Check if a backupDate directory already exists and if not, then create it.
if (!fs.existsSync(`${FOLDERS.backupJSONDir}/${backupDate}_meta`)) {
  fs.mkdirSync(`${FOLDERS.backupJSONDir}/${backupDate}_meta`);
}

// Make a copy of the metadata.json file into the backupDate directory.
fs.copyFileSync(`${FOLDERS.jsonDir}/_metadata.json`, `${FOLDERS.backupJSONDir}/${backupDate}_meta/_metadata.json`);
console.log(`Backed up _metadata.json to ${FOLDERS.backupJSONDir}/${backupDate}_meta/_metadata.json before starting process.`);

// Main function - called asynchronously
async function main() {

  // Load the list of file names from the imagesDir directory and sort them numerically
  const files = fs.readdirSync(`${FOLDERS.imagesDir}`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });

  // Loop through each file in the list.
  for (const file of files) {
    console.log(`Starting upload of file ${file}`);

    try {
      if (re.test(file)) {

        // Load the json file that matches the image file's name and parse it as JSON
        const fileName = path.parse(file).name;
        let jsonFile = fs.readFileSync(`${FOLDERS.jsonDir}/${fileName}.json`);
        let metaData = JSON.parse(jsonFile);

        // Check if the file_url field contains a value that starts with https:// and only continue processing if it does not start with it.
        if(!metaData.file_url.includes('https://')) {

          // Apply rate limit that was set in the account_details.js file
          await limit()

          // Call the fetchWithRetry function that will perform the API call
          const response = await fetchWithRetry(file);

          // Assign the file_url field of the json object being processed to the ipfs_url field that is returned from the API call.
          metaData.file_url = response.ipfs_url;

          // Re-wrtie the image file's json object to contain the new file_url field.
          fs.writeFileSync(
            `${FOLDERS.jsonDir}/${fileName}.json`,
            JSON.stringify(metaData, null, 2)
          );

          console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);

        } else {
          console.log(`${fileName} already uploaded.`);
        }

        // Add the metadata object that got written to the json file into the allMetaData array.
        allMetadata.push(metaData);
      }
    } catch(err) {
      console.log(`Catch: ${err}`)
    }
  }

  // Write the allMetaData array into the metadata.json file.
  fs.writeFileSync(
    `${FOLDERS.jsonDir}/_metadata.json`,
    JSON.stringify(allMetadata, null, 2)
  );
}

// Start the main process.
main();

// timer function - This function is used to add a timeout in between actions.
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// fetchWithRetry function - This function is used to perform API calls to upload image files
async function fetchWithRetry(file) {

  return new Promise((resolve, reject) => {

    // Set maximum number of retries as defined in account_details.js file
    let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);

    // Constant that will perform an API call and return a resolve or reject
    const fetch_retry = (_file, _numberOfRetries) => {

      // Setup the formData info for the API call so that the image file can be uploaded
      const formData = new FormData();
      const fileStream = fs.createReadStream(`${FOLDERS.imagesDir}/${file}`);
      formData.append("file", fileStream);

      // Set the API URL
      let url = "https://api.nftport.xyz/v0/files";

      // Setup the API details
      let options = {
        method: "POST",
        headers: {
          Authorization: ACCOUNT_DETAILS.auth,
        },
        body: formData,
      };

      // Perform the API call
      return fetch(url, options).then(async (res) => {
          
          // Create a variable that will contain the HTTP Status code
          const status = res.status;

          // Check the status and if 200, then move to the processing part of the object
          if(status === 200) {
            return res.json();
          } // If the status is not 200, throw an error and move to the catch block
            else {
            throw `ERROR STATUS: ${status}`;
          }
      })
      .then(async (json) => {

        // Check if the response field in the JSON packet contains "OK" and then return to the parent process with the packet and a resolve
        if(json.response === "OK"){
          return resolve(json);
        } // If the response field in the JSON packet does not contain "OK", throw an error and move to the catch block
          else {
          throw `NOK: ${json.error}`;
        }
      })
      .catch(async (error) => {
        console.error(`CATCH ERROR: ${error}`)

        // Check if there are any retry attempts left
        if (_numberOfRetries !== 0) {
          console.log(`Retrying file upload`);

          // Before performing the next API call, wait for the timeout specified in the account_details.js file
          // The total number of retries gets decremented when issuing the API call again
          await timer(TIMEOUT)
          fetch_retry(_file, _numberOfRetries - 1)

        } // If the total number of retries have been reached, then respond with a reject and finish the fetch_retry process
          else {
          console.log(`All requests unsuccessful for ${FOLDERS.imagesDir}/${file}`);
          reject(error)

        }
      });
    }

    // Call the fetch_retry constant. Pass in the image file name and the total number of retries for the API call should it experience any issues.
    return fetch_retry(file, numberOfRetries);
  });
}
