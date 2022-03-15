// Load modules and constants
const fetch = require("node-fetch");

const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.

// fetchWithRetry function - This function is used to perform API calls
function fetchWithRetry(url, options) {
    return new Promise((resolve, reject) => {
  
      // Set maximum number of retries as defined in account_details.js file
      let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);
  
      // Constant that will perform an API call and return a resolve or reject
      const fetch_retry = (_url, _options, _numberOfRetries) => {
  
        // Perform the API call
        return fetch(_url, _options).then(async (res) => {
  
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
            console.log(`Retrying api call`);
  
            // Before performing the next API call, wait for the timeout specified in the account_details.js file
            // The total number of retries gets decremented when issuing the API call again
            //await timer(TIMEOUT) // Commented out functionality as it cause the process to hang at times.
            fetch_retry(_url, _options, _numberOfRetries - 1)
  
          } // If the total number of retries have been reached, then respond with a reject and finish the fetch_retry process
            else {
            console.log("All requests were unsuccessful for current item.");
            reject(error)
  
          }
        });
      }
  
      // Call the fetch_retry constant. Pass in the meta JSON object and the total number of retries for the API call should it experience any issues.
      return fetch_retry(url, options, numberOfRetries);
    });
}

module.exports = { fetchWithRetry };
