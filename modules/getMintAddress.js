const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { ACCOUNT_DETAILS } = require(`${FOLDERS.constantsDir}/account_details.js`);

// getMintAddress function - Retrieves wallet address that will receive edition mint and if no mapping can be found, then mint to the default mint_to_address in account_details.js
function getMintAddress(edition) {
  try {
    
    // Load the _walletAddressMintList.json file
    const walletAddressMintList = JSON.parse(fs.readFileSync(`${FOLDERS.ipfsMetasDir}/_walletAddressMintList.json`));

    // Check if the edition can be found in the _walletAddressMintList.json file.
    if(typeof walletAddressMintList[edition-1] === 'undefined') {

      // Return the default mint_to_address from account_details.js
      return ACCOUNT_DETAILS.mint_to_address;
    }

    // Return the wallet address from the _walletAddressMintList.json file
    return walletAddressMintList[edition-1];

  } catch {
    
    // Return the default mint_to_address from account_details.js
    return ACCOUNT_DETAILS.mint_to_address;
  }
}

module.exports = { getMintAddress };