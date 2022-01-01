# The Peanut Gallery And Co's take on the code bases created by Hashlips and codeSTACKr

Base code is from
- [hashlips_art_engine](https://github.com/HashLips/hashlips_art_engine)
- [codeSTACKr](https://github.com/codeSTACKr/video-source-code-create-nft-collection/)

File Uploads can be done via Pinata or a similar service that gives you a single CID for images and another one for meta files or [NFTPort](https://nftport.xyz) can be used.
Minting uses [NFTPort](https://nftport.xyz)

## Reference the following videos from both the core code developers for more details.
Please note that some of the commands have changed and have been updated compared to the original videos, please see them under the different sections for each script / process that you can run.
- Hashlips - [video](https://www.youtube.com/playlist?list=PLvfQp12V0hS3AVImYdMNfkdvRtZEe7xqY)
- codeSTACKr - [video](https://youtu.be/AaCgydeMu64)

## TIP Address
If you feel that this has benefitted you in any way and would like to make a contribution towards The Peanut Gallery And Co, then please use the following MetaMask wallet address:
- 0x5cE5D823f4bD8Ec610868fBa65832B479152C7E1

## NFT Collection
If you would like to support my NFT collection, please take a look at the below.
- https://opensea.io/collection/steak-bites (Polygon chain)


## Dependencies for scripts to run
- `npm install`
- `npm install node-fetch@2`
- `npm install async-sema`

## UPDATES & FIXES

### Multiple Codebase Usage
Some users have already started creating their files and minting some of their files from previous code bases which makes use of both _ipfsMetas.json and _metadata.json files. This code base only makes use of the _metadata.json file. There is a new utils/migrate_json_between_ipfs_and_metadata.js script that will migrate the metadata_uri field from the ipfs file over to the metadata file so that the minting processes of this repo can work without issues. Please run it by making use of the "Main - Migrate_Json_Between_Ipfs_And_Metadata Command" below.

### Retry Limit Addition
Added a retry limit for the API calls into NFTPort so that after x number of retries, the attempt for the specific file will be stopped and the next file will be tried. This was added to be able to potentially process other files as a specific file might have issues.

### "Quota Limit Reached" or "Too many requests" errors
Users have been experiencing issues in terms of API limitting. A new library "async-sema" was added and you can now adjust your APIKey's rate limit from the ACCOUNT_DETAILS constant file. It seems to be not an exact science, so to be more successful in processing all of your files in one go, try to put the max_rate_limit at one less than your APIKey's limit.


## How To Use The Codebase
Below is a rough guideline of the order in which the processes can be used.

### 1. Update The Main Configuration File
Update the src/config.js file with the different settings for your generative art collection.

### 2. Configure NFT Creation Details
Update the constants/nft_details.js file with the details that you want to be added to your metadata for your generative art collection.

### 3. Configure Account Details - If you are using NFTPort
Update the constants/account_details.js file with the NFTPort account details. These will only be used with the NFTPort scripts. This will be needed if you are uploading files or minting via NFTPort. Please ensure that your contract allows for NFT updates if you are planning on doing NFT reveals after purchases.

### 4. Create Image Layers
Create your different art layers, keeping all of them at the same Canvas size and ensuring they are all exported as .png files.

### 5. Main Generative Art Creation
Use the 'Main - Build Command' below to create your generative art collection along with their metadata json files.

### 6. Additional Art Creation Options
- Use the 'Main - Pixelate Command' below to create a pixelated art collection from your previous generative art collection.
- Use the 'Main - Preview Command' below to create a preview of your generative art collection by combining a few of the images into a single image.
- Use the 'Main - Preview_Gif Command' below to create a preview_gif of your generative art collection by combining a few of the images into a single gif that loops through some of your images.

### 7. Rarity Information
- Use the 'Main - Rarity Command' below to generate a JSON output to the terminal that will show you how your layers will be distributed.

### 8. Update NFT's Info (Description And Name)
- Use the 'Main - Update_Nft_Info Command' below to update all NFT JSON files with the new namePrefix and description from the constants/nft_details.js file.

### 9. Update NFTs For Reveal - Generic Image Until Purchased, Then Only Reveal NFT
- Use the 'Main - Update_Json_To_Generic_Meta Command' below to update all NFT files with the generic image URL that will be shown as your NFTs picture before a purchase. Please remember that your contract needs to be updateable to use this, otherwise this image will stay the image of your NFT, before and after purchase. Please remember to update the file_url field with the URL where the generic image is, otherwise you will get the one in the code base. This process will create a new genericJSON directory where the _metadata.json file will be located along with each file's generic JSON object file. Remember to change your Upload Metas process to point to this directory instead of the normal json directory if you are making use of reveals.

### 10. Uploading Files
There are two options that you can follow to upload your images and json files onto IPFS. Option 1 would be to go via a service like Pinata that gives a static CID to be used, while Option 2 would be to go directly via NFTPort, however, the CID will be unique for each file.

#### Option 1 - Pinata Or Similar Service
Create an account on Pinata (https://app.pinata.cloud/) and then upload your images folder. Please note that once you have uploaded your folder, you can't add or remove any files from there. From there copy the CID into the constants/nft_details.js file against the "imageFilesBase" key.

Use the 'Update_Image_Info Command' below to update the json files for each NFT.
This process will update the description, file_url, image and name fields within the json.

Upload the json directory onto Pinata and copy the CID into the constants/nft_details.js file against the "metaDataJSONFilesBase" key. This should be either of your json or genericJSON directories, depending on whether you are doing a reveal or not.

Use the 'Update_Metadata_Info Command' below to update the json files for each NFT.
This process will update the metadata_uri fields within the json.

#### Option 2 - NFTPort
Create an account on NFTPort (https://www.nftport.xyz/) and get an APIKey. Be sure to check your rate limit of your account as well as the amount of NFTs that you can upload with your APIKey's access levels. Update your account's details in the constants/account_details.js file.

Use the 'NFTPort - UploadFiles Command' below to upload the image files to IPFS and then update the json files for each NFT with the file_url and image details.
This process will update the description, file_url, image and name fields within the json.

Use the 'NFTPort - UploadMetas Command' below to upload the json files for each to IPFS and then add the response of each upload to the "_ipfsMetas.json" file.
This process will also update the "_metadata.json" file with the add the metadata_uri fields to each object. The "_ipfsMetas.json" file is no longer used, it is merely created for a reference to the metadata upload response packets.

*Important* - Should you wish to do a reveal, please remember that your contract should allow for updates to your NFT files. You also need to update line #7 in the utils/nftport/uploadMetas.js file to point to "genericJSONDir" instead of "jsonDir" as this is where your meta files live with the generic image.

### 11. Minting NFTs
Use the "NFTPort - Mint Command" below to start minting all of your NFTs.
Use the "NFTPort - Mint_Range Command" below to start minting a range of NFTs between specific editions.
Use the "NFTPort - Mint_Item Command" below to start minting a specific NFT edition.

Please remember to change your json minting directory at line #8 if you want to make use of a Reveal and you want to mint the generic json files.

The following issues has been seen while minting:
- Transactions receiving back a NOK - These will need to be re-minted and can't be found on the blockchain.
- Transactions receiving back an OK - Some of the transaction hashes and transaction URLs can't be found on the blockchain. These will need to be re-minted.

### 12. Checking NFT Mint Files For Issues
Use the "Main - Check Mints Command" below to start checking each mint file to determine if there are any issues with the minted files. The check performs validation of the issues experienced in the Minting NFTs section and writes out the json files into a failedMints directory. Every time this runs, it clears out the folder and starts again.

*Please note that this process takes time to complete as it runs through every minted json file*

### 13. Re-Mint Failed NFTs
Use the "NFTPort - ReMint Command" below to start re-minting each of the json files in the failedMints directory. This process will write out a newly minted file in the reMinted directory as well as update the json file in the original minted directory. Due to this, a backup folder will be created every time this process runs with the date to keep a backup of the json file in the minted directory at the time of running this process just as a safe guard so that you have access to the original information or how the information changed in between your processing.

### Check Your Work On The Marketplace
You are done with your minting process!
Well done!
Go and check out your mints on your marketplace and refresh the metadata where needde.

GOOD LUCK!


## Main Commands
Use the following command from the code's root directory.

### Build Command
- npm run build

### Check Mints
- node utils/check_mints.js
- npm run check_mints

### Migrate_Json_Between_Ipfs_And_Metadata
- node utils/migrate_json_between_ipfs_and_metadata.js
- npm run migrate_json_between_ipfs_and_metadata

### Pixelate Command
- node utils/pixelate.js
- npm run pixelate

### Preview Command
- node utils/preview.js
- npm run preview

### Preview_Gif Command
- node utils/preview_gif.js
- npm run preview_gif

### Rarity Command
- node utils/rarity.js
- npm run rarity

### Update_Image_Info Command
- node utils/update_image_info.js
- npm run update_image_info

### Update_Json_To_Generic_Meta Command
- node utils/update_json_to_generic_meta.js
- npm run update_json_to_generic_meta

### Update_Metadata_Info Command
- node utils/update_metadata_info.js
- npm run update_metadata_info

### Update_Nft_Info Command
- node utils/update_nft_info.js
- npm run update_nft_info

## NFTPort Commands
Use the following command from the code's root directory.

### Mint_Item Command
- node utils/nftport/mint_item.js
- npm run mint_item

### Mint_Range Command
- node utils/nftport/mint_range.js
- npm run mint_range

### Mint Command
- node utils/nftport/mint.js
- npm run mint

### ReMint Command
- node utils/nftport/remint.js
- npm run remint

### UploadFiles Command
- node utils/nftport/uploadFiles.js
- npm run uploadFiles

### UploadMetas Command
- node utils/nftport/uploadMetas.js
- npm run uploadMetas
