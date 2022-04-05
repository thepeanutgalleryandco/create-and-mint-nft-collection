// Load modules and constants
const fs = require('fs');
const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const START_EDITION = 1; // Set the start edition of the collection where you want to start cancelling NFTs from.
const END_EDITION = 1; // Set the end edition of the collection where you want to stop cancelling NFTs at.
const METAMASK_ACCOUNT_NUMBER = 1; // Set the account to be used from your metamask wallet list.

let COLLECTION_BASE_URL = '';

// Main function
async function main() {

    /* 
    Launch a new chrome automation browser
    metamaskVersion tested and working = "v10.1.1"
    @chainsafe/dappeteer tested and working = "v2.3.0"
    */
    const browser = await dappeteer.launch(puppeteer, {
        headless: false,
        defaultViewport: null,
        timeout: 180000,
        metamaskVersion: `v10.1.1`,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    
    /* 
    Setup and login to metamask
    1. Go to your metamask
    2. Click settings
    3. Click Security & Privacy
    4. Enter passphrase
    5. Copy or write down your seed phrase as you will need to enter it when the script runs.
    
    6. 
    ***************************************************************************************************************************************************
    WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
    ***************************************************************************************************************************************************
    WHEN RUNNING THE SCRIPT, YOU CAN EITHER MANUALLY ENTER YOUR SEED PHRASE OR YOU REPLACE THE VALUE OF seed: 'test' WITH YOUR SEED PHRASE.
    IF YOU CHOOSE THE OPTION OF STORING YOUR SEED PHRASE, THEN PLEASE DO NOT SHARE THIS WITH ANYONE ELSE AND DO NOT SHARE THIS SCRIPT FILE WITH ANYONE ELSE 
    BEFORE REMOVING YOUR SEED PHRASE!!!!!!!!!!!!!
    ***************************************************************************************************************************************************
    WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
    ***************************************************************************************************************************************************
    
    */
    const metamask = await dappeteer.setupMetamask(browser, {
      seed: 'test',
      password: '1234567890',
      hideSeed: true
    });
    
    // Check if the collection is on the polygon or ethereum network
    if (ACCOUNT_DETAILS.chain.toLowerCase().includes('polygon')) {
        
        // Add Polygon network
        await metamask.addNetwork({
            networkName: "polygon",
            rpc: "https://polygon-rpc.com/",
            chainId: 137,
            symbol: "MATIC",
            explorer: "https://polygonscan.com/",
        });
    
        // Switch to Polygon network
        await metamask.switchNetwork("polygon");

        // Set the base of the collection URL on Opensea
        COLLECTION_BASE_URL = "https://opensea.io/assets/matic" ;

    } else {

        // Set the base of the collection URL on Opensea
        COLLECTION_BASE_URL = "https://opensea.io/assets" ;
    }

    // Switch to specific account on Metamask seed
    if (METAMASK_ACCOUNT_NUMBER != 0 && METAMASK_ACCOUNT_NUMBER != 1) {
        metamask.switchAccount(METAMASK_ACCOUNT_NUMBER);
        console.log(`Updated Metamask account number to ${METAMASK_ACCOUNT_NUMBER}`);
    }

    // Set your collection URL. The contract address from the account_details.js file will be used.
    COLLECTION_BASE_URL = `${COLLECTION_BASE_URL}/${ACCOUNT_DETAILS.contract_address}/` ;

    console.log("Starting with removing collection items from being on sale on Opensea - " + COLLECTION_BASE_URL);
    
    // Create a new tab and launch opensea.io, to the account page
    const page = await browser.newPage();
    await page.goto("https://opensea.io/account", { waitUntil: "networkidle0" });

    // Force list of wallets to refresh as otherwise OpenSea sometimes doesn't detect MetaMask properly
    const accountMoreButton = await page.$x('//button[contains(.,"Show more options")]');
    await accountMoreButton[0].click();
    await page.waitForTimeout(1000);
    
    // Click on metamask button
    const metaMaskButton = await page.$x('//button[.//span[contains(text(),"MetaMask")]]' );
    await metaMaskButton[0].click();
    
    // Approve the request from metamask on the metamask tab
    await metamask.approve();
    
    // Return to Opensea page
    await page.bringToFront();

    // Reload the page
    await page.reload({ waitUntil: "networkidle0" });
        
    // Loop from the start edition up until the end edition that has been set. Both values are inclusive.
    for (let i = START_EDITION; i <= END_EDITION; i++) {    
        try {
            console.log(`Starting to remove sale from edition: ${i}`);

            // Set the website URL of the NFT edition
            const url = COLLECTION_BASE_URL + i.toString();

            // Open the URL on the new tab that got created
            await page.goto(url, { waitUntil: "networkidle0" });

            // Look for a button containing Cancel on the page
            const cancelElements = await page.$x("//button[contains(., 'Cancel')]");
            await cancelElements[0].click() ;
            await page.waitForTimeout(3000);

            // Go to the confirm button and click it
            await page.keyboard.press('Tab', { page }); // navigate to button
            await page.keyboard.type('\n'); // hit enter
            
            // Go to the sign button and click it
            await page.focus('div[aria-hidden="false"]');
            
            for (j=0; j < 3; j++) {
                await page.keyboard.press('Tab', { page }); // navigate to button
            }
            await page.keyboard.type('\n'); // hit enter

            await metamask.sign();
            await page.bringToFront();
            await page.waitForTimeout(2000);

            console.log(`Edition successfully removed from being on sale: ${i} , URL: ${url}`);

        } catch (error) {

            // If any issues come up, then log the error and continue to the next edition
            console.log(`Error ${error} when attempting to remove edition from sale: ${i}`);

            // Bring the main tab into view
            await page.bringToFront();
        }
    }

    // Wait a few seconds before closing the browser.
    await page.waitForTimeout(5000);

    // Close the chrome automation browser after all editions got refreshed
    await browser.close();

    console.log("Done with putting collection editions on sale on Opensea - " + COLLECTION_BASE_URL);
}

// Start the Main function.
main().then(function () {
});