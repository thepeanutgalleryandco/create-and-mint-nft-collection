// Load modules and constants
const fs = require('fs');
const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const MAX_LOOPS = 1; // Set the maximum number of unhide attempts that will be done on the collection if items are found.
const NFT_COLLECTION_NAME = ''; // Set the name of the NFT collection so that it can be found in your hidden tab.
const walletPrivateKey = ''; // Set the private key of the wallet that you would like to import and use. Upon importing a private key, the imported wallet will automatically be chosen.
/* 
Retrieving your wallet private key:

Setup and login to metamask
1. Go to your metamask
2. Select the wallet that you would like to make use of from the drop down of accounts.
3. Click on the settings (three dots)
4. Choose account details
5. Choose export private key
6. Enter metamask password
7. Copy your private key as the value for your walletPrivateKey field above this section.

Example:
walletPrivateKey = '8e51i2n3i2oco3o102k3k2k31k2nifn0139r17213k2hhh1i23p142e1o124ao11';

***************************************************************************************************************************************************
WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
***************************************************************************************************************************************************

PLEASE DO NOT SHARE THIS WITH ANYONE ELSE AND DO NOT SHARE THIS SCRIPT FILE WITH ANYONE ELSE BEFORE REMOVING YOUR walletPrivateKey value!!!!!!!!!!!!!

***************************************************************************************************************************************************
WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
***************************************************************************************************************************************************

*/

let COLLECTION_BASE_URL = '';
let SIGNED_ONCE = false;

// Main function
async function main() {

    /* 
    Launch a new chrome automation browser
    metamaskVersion tested and working = "v10.8.1"
    @chainsafe/dappeteer tested and working = "v2.4.1"
    */
    const browser = await dappeteer.launch(puppeteer, {
        headless: false,
        defaultViewport: null,
        timeout: 180000,
        metamaskVersion: `v10.8.1`,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    
    // Create new metamask account and sign in to metamask. A random seed phrase gets used.
    const metamask = await dappeteer.setupMetamask(browser, {
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

    // Import private key if walletPrivateKey is populated
    if (walletPrivateKey) {
        await metamask.importPK(walletPrivateKey);    
        console.log(`Imported wallet private key`);
    }      

    // Set your collection URL. The contract address from the account_details.js file will be used.
    COLLECTION_BASE_URL = `${COLLECTION_BASE_URL}/${ACCOUNT_DETAILS.contract_address}/` ;

    console.log("Starting with unhiding collection items on Opensea - " + COLLECTION_BASE_URL);
    
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

    await page.goto("https://opensea.io/account?tab=private", { waitUntil: "networkidle0" });
    await page.waitForTimeout(1000);

    // Go to the Search box and enter the NFT collection name
    await page.waitForSelector('input[placeholder=Search]');
    await page.type('input[placeholder=Search]', `${NFT_COLLECTION_NAME}`, {delay: 15});
    await page.keyboard.type('\n'); // hit enter
    await page.waitForTimeout(2000);

    const unhidingPage = page.url() + '&select=unhide';

    try {

        console.log(`Getting unhidden NFTs list`);

        // Press space bar 5 times to load more items
        for (m = 0; m < 5; m++) {
            await page.keyboard.type(`Space`, {delay: 15});
        }
    
        // Get the hidden NFT count on the screen
        let childrenLength = await page.evaluate(() => {
            return (Array.from(document.querySelector('div[role="grid"]').children).length);
        });

        console.log(childrenLength);        
        
        // Set the loop counter.
        let k = 0;

        while (childrenLength !== 0) {

            // Increment loop counter
            k++ ;

            // Load the searched page with unhide mode already selected
            await page.goto(unhidingPage , { waitUntil: "networkidle0" });            

            // Select items to be unhidden
            for (i = 1; i <= childrenLength && i < 21; i++) {
                await page.waitForTimeout(100);
                await page.click(`div[role="grid"] > div:nth-child(${i})`);
            }

            // Click unhide button
            const unhideElements = await page.$x("//button[contains(., 'Unhide')]");
            await unhideElements[0].click() ;
            await page.waitForTimeout(3000);
            console.log(`Clicked on unhide button`);
            
            // If it is the first time unhiding, then sign the transaction
            if (!SIGNED_ONCE) {
                await metamask.sign();
                await page.bringToFront();
                await page.waitForTimeout(2000);                

                // Set signed value so that sign is not triggered on every unhide action
                SIGNED_ONCE = true;

                console.log(`Signed transaction`);
            }

            // Check if the maximum loop limit has been reached and exits the program if it is the case
            if (k === MAX_LOOPS) {
                console.log("Maximum loops reached, exiting the script now.");
                process.exit();
            }

            console.log(`Getting unhidden NFTs list`);

            // Press space bar 5 times to load more items
            for (m = 0; m < 5; m++) {
                await page.keyboard.type(`Space`, {delay: 15});
            }
    
            // Get the hidden NFT count on the screen
            childrenLength = await page.evaluate(() => {
                return (Array.from(document.querySelector('div[role="grid"]').children).length);
            });

            console.log(childrenLength); 
        }

    } catch (error) {
        console.log(error);
        console.log("Your collection has no more hidden NFTs.");
    }

    // Wait a few seconds before closing the browser.
    await page.waitForTimeout(5000);

    // Close the chrome automation browser after all editions got refreshed
    await browser.close();

    console.log("Done with unhiding collection editions on Opensea - " + COLLECTION_BASE_URL);
}

// Start the Main function.
main().then(function () {
});

async function getNFTList(_page) {

    return _childrenLength;
}