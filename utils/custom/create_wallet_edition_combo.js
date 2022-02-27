// Load modules and constants
const fs = require("fs");
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

const re = new RegExp("^([0-9]+).json$"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.

let walletListMintCount = 0;
let walletNFTList = [];

// Check if the ipfsMetasDir directory exists and if not, then exit.
if (!fs.existsSync(`${FOLDERS.ipfsMetasDir}`)) {
  console.error(`The ${FOLDERS.ipfsMetasDir} directory does not exsit. Please make sure that the metadata files have been uploaded and a ${FOLDERS.ipfsMetasDir} directory exists.`);
  process.exit(1);
}

// Main function - called asynchronously
async function main() {
    
    // Loop through wallet list
    ACCOUNT_DETAILS.walletMintList.forEach((wallet) => {

        // Loop through the NFT wallet count for each wallet and add the wallet into an array
        for (i = 1; i <= wallet.nft_count; i++) {
            walletNFTList.splice(walletListMintCount, 0, wallet.wallet_address);
            walletListMintCount++ ;
        }
    });

    // Create a _walletListMint.json file that contains a shuffled version of the wallet array list that got created and t
    fs.writeFileSync(`${FOLDERS.ipfsMetasDir}/_walletAddressMintList.json`, JSON.stringify(shuffle(walletNFTList), null, 2));  

    console.log(`Total of ${walletListMintCount} NFT editions assigned to a wallet address`);
}


// Start the main process.
main();

// Shuffle function - shuffles the items in an array to new indexes places
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}