// Load modules and constants
const fs = require('fs');
const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const START_EDITION = 1; // Set the start edition of the collection where you want to start selling NFTs from.
const END_EDITION = 1; // Set the end edition of the collection where you want to stop selling NFTs at.
const NFT_PRICE = 0.002; // Set the price that will be given to each NFT between START_EDITION and END_EDITION.
const DROPDOWN_OPTION = 0; // Set the dropdown option to setup the date picker. Leave at 0 to keep the default sell timeframe. Do not add more options than what there is in the Opensea list. Do not count the default item in the list.
const DATE_PICK_SKIP = 7; // Set the tabs between the date picker drop down and the time. This value should be set between 6, 7 and 8. Please check the comment where this variable is used for more information.
const START_HOUR = 18; // Set the start hour for the sale.
const START_MINUTE = 00; // Set the start minute for the sale.
const END_HOUR = 23; // Set the end hour for the sale.
const END_MINUTE = 59; // Set the end minute for the sale.
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

    console.log("Starting with putting collection items on sale on Opensea - " + COLLECTION_BASE_URL);
    
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
            console.log(`Starting to put edition on sale: ${i}`);

            // Set the website URL of the NFT edition
            const url = COLLECTION_BASE_URL + i.toString();

            // Open the URL on the new tab that got created
            await page.goto(url, { waitUntil: "networkidle0" });

            // Look for a button containing Sell on the page
            const sellElements = await page.$x("//a[contains(., 'Sell')]");
            await sellElements[0].click() ;

            // Go to the price input box and enter the price
            await page.waitForSelector('input[name=price]');
            await page.type('input[name=price]', `${NFT_PRICE}`, {delay: 15});

            // If drop down option is left at 0, then the default date, start and end hour will be used and will skip to the putting the item on sale.
            // If drop down is populated with a positive number in the list, then navigate to that list item and choose it and also set the start date, end date and time
            if (DROPDOWN_OPTION > 0) {

                // Navigate to the date picker
                for (j=0; j < 3; j++) {
                    await page.keyboard.press('Tab', { page }); // navigate to button
                }
                
                // Navigate to drop down option and choose it
                for (j=0; j < DROPDOWN_OPTION; j++) {
                    await page.keyboard.press('Tab', { page }); // navigate to button
                }
                await page.keyboard.press('Space', { page }); // hit space button

                /* Go to the time picker
                    Please note that sometimes, the date picker will be out by a few presses, depending on the date that you are running the script on.
                    This happens when you are for example in a month of 31 days, and you are trying to go to a month that do not have 31 days
                    If you face this scenario, simply change the DATE_PICK_SKIP value to the right amount of tabs that is needed from 
                    choosing the list item on the dropdown. You simply press the tab button after choosing the drop down item until you get to the time
                    picker. Count the number of tabs required and enter that amount at DATE_PiCK_SKIP at the top of the file. The value is usually between 
                    6, 7 and 8, but might need some tweaking.
                */
                for (j=0; j < DATE_PICK_SKIP; j++) {
                    await page.keyboard.press('Tab', { page }); // navigate to button
                }
    
                // Enter start time and end time
                await page.keyboard.type(`${START_HOUR}`, {delay: 15});
                await page.keyboard.type(`${START_MINUTE}`, {delay: 15});
                await page.keyboard.press('Tab', { page }); // navigate to button
                await page.keyboard.type(`${END_HOUR}`, {delay: 15});
                await page.keyboard.type(`${END_MINUTE}`, {delay: 15});
    
                // Exit date picker
                await page.keyboard.press('Tab', { page }); // navigate to button
            }
            
            // Go to the submit button and click it
            await page.waitForSelector('button[type=submit]');
            await page.click('button[type=submit]');
            await page.waitForTimeout(2000);

            // Go to the sign button and click it
            await page.focus('div[aria-hidden="false"]');
            
            for (j=0; j < 3; j++) {
                await page.keyboard.press('Tab', { page }); // navigate to button
            }
            await page.keyboard.type('\n'); // hit enter

            await metamask.sign();
            await page.bringToFront();
            await page.waitForTimeout(2000);

            console.log(`Edition successfully put on sale: ${i} , URL: ${url}`);

        } catch (error) {

            // If any issues come up, then log the error and continue to the next edition
            console.log(`Error ${error} when attempting to put edition on sale: ${i}`);

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