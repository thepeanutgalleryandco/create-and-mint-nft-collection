// Load modules and constants
const { RateLimit } = require('async-sema');
const fetch = require("node-fetch");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const TIMEOUT = Number(ACCOUNT_DETAILS.timeout); // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.
const limit = RateLimit(Number(ACCOUNT_DETAILS.max_rate_limit)); // Ratelimit for your APIKey
const ownedNFTs = []

// Check if the revealedDir directory exists, if it does not exist then create it.
if (!fs.existsSync(`${FOLDERS.revealedDir}`)) {
    fs.mkdirSync(`${FOLDERS.revealedDir}`);
}

// checkOwnedNFTs function - This function is used to perform API calls to check your owned NFTs
async function checkOwnedNFTs() {

  try {
    // Set the start paging values and API URL
    let page = 1
    let lastPage = 1
    let url = `https://api.nftport.xyz/v0/accounts/${ACCOUNT_DETAILS.mint_to_address}?chain=${ACCOUNT_DETAILS.chain}&page_number=`
    
    // Setup the API details
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: ACCOUNT_DETAILS.auth,
      }
    };

    // Call the fetchWithRetry function that will perform the API call to mint the JSON object
    let ownedNFTsData = await fetchWithRetry(`${url}${page}`, options)

    // Loop through each NFT in the nfts array being returned by the API
    for(ownedNFT of ownedNFTsData.nfts) {

      // Check to see if the contract address of the nft matches the contract address in the account_details.js file
      if(ownedNFT.contract_address === ACCOUNT_DETAILS.contract_address) {
        console.log(`Contracts Match! Adding to list.`);

        // Add the tokenID of the NFT into the ownedNFTs array
        ownedNFTs.push(parseInt(ownedNFT.token_id))
      }
    }

    // Get the max number of pages to loop through
    lastPage = Math.ceil(ownedNFTsData.total / 50)

    // While the current page number is not equal to the max page number, loop
    while(page < lastPage) {
      
      // Increment the page number
      page++

      // Call the fetchWithRetry function that will perform the API call to mint the JSON object
      ownedNFTsData = await fetchWithRetry(`${url}${page}`, options)

      // Loop through each NFT in the nfts array being returned by the API
      for(ownedNFT of ownedNFTsData.nfts) {

        // Check to see if the contract address of the nft matches the contract address in the account_details.js file
        if(ownedNFT.contract_address === ACCOUNT_DETAILS.contract_address) {
          console.log(`Contracts Match! Adding to list.`);

          // Add the tokenID of the NFT into the ownedNFTs array
          ownedNFTs.push(parseInt(ownedNFT.token_id))
        }
      }
    }
  } catch (error) {
    console.log(`Catch: Error - ${error}`) ;
  }

  // Call the reveal function
  reveal()
}

// reveal function - reveals all nfts that do not belong to 
async function reveal() {

  // Read the metadata.json file and parse it as JSON
  const metaDataJson = JSON.parse(
    fs.readFileSync(`${FOLDERS.jsonDir}/_metadata.json`)
  );

  // Loop through the json objects in the metadata.json file
  for (const meta of metaDataJson) {
    console.log(`Starting with ${meta.name}`);

    // Get the edition of the json object
    const edition = meta.custom_fields.edition

    // Check if the edition can be found in the ownedNFTs array
    if(!ownedNFTs.includes(edition)) {
      console.log(`${edition} does not belong to you`)

      // Set the revealed file's full path
      const revealedFilePath = `${revealedDir}/${edition}.json`;

      try {

        // Try to access and read the file if it already exists
        fs.accessSync(revealedFilePath);
        const revealedFile = fs.readFileSync(revealedFilePath)

        // Check if the file has content in it and is not an empty file
        if(revealedFile.length > 0) {

          // Read the existing file and parse it as JSON
          const revealedFileJson = JSON.parse(revealedFile)

          // Check if the response is not OK and if that is the case, throw an error to go to the reveal stage, 
          // otherwise if it is OK, then state that it is already revealed
          if(revealedFileJson.updateData.response !== "OK") throw 'not revealed'
            console.log(`${meta.name} already revealed`);
        } // If the file is empty, throw an error that it is not revealed yet and go to the reveal stage.
          else {
          throw 'not revealed'
        }
      } catch(err) {
        try {

          // Set the API URL
          let url = "https://api.nftport.xyz/v0/mints/customizable";

          // Set the updated metadata info required for the API from the meta field and account_details.js file
          const updateInfo = {
            chain: ACCOUNT_DETAILS.chain,
            contract_address: ACCOUNT_DETAILS.contract_address,
            metadata_uri: meta.metadata_uri,
            token_id: meta.custom_fields.edition,
          };

          // Setup the API details
          let options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: AUTH,
            },
            body: JSON.stringify(updateInfo),
          };

          // Apply rate limit that was set in the account_details.js file
          await limit()

          // Call the fetchWithRetry function that will perform the API call to update the metadata
          let updateData = await fetchWithRetry(url, options, meta)
          console.log(`Updated: ${meta.name}`);

          // Combine the metadata from the JSON object with the updatedData from the API call
          const combinedData = {
            metaData: meta,
            updateData: updateData
          }

          // Write the newly minted data to revealed directory
          writeMintData(meta.custom_fields.edition, combinedData)

        } catch(err) {
          console.log(err)
        }
      }
    }
    console.log(`Done with ${meta.name}`);
  }

  console.log(`Done revealing! Will run again in ${(ACCOUNT_DETAILS.salesInterval/1000)/60} minutes`)
}

// fetchWithRetry function - This function is used to perform API calls
async function fetchWithRetry(url, options, meta)  {
  return new Promise((resolve, reject) => {

    // Set maximum number of retries as defined in account_details.js file
    let numberOfRetries = Number(ACCOUNT_DETAILS.numberOfRetries);

    // Constant that will perform an API call and return a resolve or reject
    const fetch_retry = (_url, _options, _meta, _numberOfRetries) => {
      
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
          console.log(`Retrying mint update`);

          // Before performing the next API call, wait for the timeout specified in the account_details.js file
          // The total number of retries gets decremented when issuing the API call again
          await timer(TIMEOUT)
          fetch_retry(_url, _options, _meta, _numberOfRetries - 1)

        } // If the total number of retries have been reached, then respond with a reject and finish the fetch_retry process
          else {
          console.log(`All requests unsuccessful`);
          reject(error)

        }
      });
    }    
    
    // Call the fetch_retry constant. Pass in the url, options, meta JSON object and the total number of retries for the API call should it experience any issues.
    return fetch_retry(url, options, meta, numberOfRetries);
  });
}

// timer function - This function is used to add a timeout in between actions.
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// Write the revealed json file into the revealed folder
const writeMintData = (_edition, _data) => {
  fs.writeFileSync(`${revealedDir}/${_edition}.json`, JSON.stringify(_data, null, 2));
};

// Sleep for the number of seconds set in the account_details.js file
setInterval(checkOwnedNFTs, ACCOUNT_DETAILS.salesInterval)

// Call the checkOwnedNFTs function
checkOwnedNFTs()