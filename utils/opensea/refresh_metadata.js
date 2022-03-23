// Load modules and constants
const fs = require('fs');
const puppeteer = require('puppeteer');
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const START_EDITION = 1; // Set the start edition of the collection where you want to start refreshing metadata.
const END_EDITION = 1; // Set the end edition of the collection where you want to stop refreshing metadata.

let COLLECTION_BASE_URL = '';

if (ACCOUNT_DETAILS.chain.toLowerCase().includes('polygon')) {
    // Set the base of the collection URL on Opensea
    COLLECTION_BASE_URL = "https://opensea.io/assets/matic" ;
} else {
    // Set the base of the collection URL on Opensea
    COLLECTION_BASE_URL = "https://opensea.io/assets" ;
}

// Set your collection URL. The contract address from the account_details.js file will be used.
COLLECTION_BASE_URL = `${COLLECTION_BASE_URL}/${ACCOUNT_DETAILS.contract_address}/` ;

// Main function
async function main() {

    // Launch a new chrome automation browser
    const browser = await puppeteer.launch(
        {
            headless: false,
            timeout: 60000,
        }
    );

    console.log("Starting with refresh of collection metadata on Opensea - " + COLLECTION_BASE_URL);

    // Create a new tab
    const page = await browser.newPage();
    
    // Loop from the start edition up until the end edition that has been set. Both values are inclusive.
    for (let i = START_EDITION; i <= END_EDITION; i++) {    
        try {
            console.log(`Starting refresh of edition: ${i}`);

            // Set the website URL of the NFT edition
            const url = COLLECTION_BASE_URL + i.toString();

            // Open the URL on the new tab that got created
            await page.goto(url);

            // Wait for 2 seconds for the page to load
            await page.waitForTimeout(2000);

            // Look for a button containing refresh on the page
            const elements = await page.$x("//button[contains(., 'refresh')]")

            // Click on the refresh button
            await elements[0].click() 

            // Wait for 5 seconds for the refresh to go through
            await page.waitForTimeout(5000);

            console.log(`Done with refresh of edition: ${i} , URL: ${url}`);

        } catch (error) {

            // If any issues come up, then log the error and continue to the next edition
            console.log(`Error ${error} when attempting to refresh edition: ${i}`);
        }
    }

    // Close the chrome automation browser after all editions got refreshed
    await browser.close();

    console.log("Done with refresh of collection metadata on Opensea - " + COLLECTION_BASE_URL);
}

// Start the Main function.
main().then(function () {
});