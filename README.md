# The Peanut Gallery And Co's take on the code bases created by Hashlips and codeSTACKr

To find out more about The Peanut Gallery And Co, please visit:

[💻 Discord](https://discord.com/invite/ShakdpwGEn)

[🐦 Twitter](https://twitter.com/PeanutGalAndCo)

[📱 Instagram](https://www.instagram.com/thepeanutgalleryandco/)

[🌲 Linktree](https://linktr.ee/ThePeanutGalleryandco)

Base code is from the below repos - Massive thank you to the teams behind these repos!
- [hashlips_art_engine](https://github.com/HashLips/hashlips_art_engine)
- [codeSTACKr](https://github.com/codeSTACKr/video-source-code-create-nft-collection/)
- [Gerhard Molin - Provenance Addition](https://github.com/avocadohooman)
- [Arnau González - Exclusions Addition](https://github.com/arnaugm)
- [Andy Jiang Pro - Opensea Metadata Refresh](https://github.com/AndyJiangPro)

File Uploads can be done via [Pinata](https://app.pinata.cloud/) or a similar service that gives you a single CID for images and another one for meta files or [NFTPort](https://nftport.xyz) can be used.

Minting uses [NFTPort](https://nftport.xyz)


## Reference the following videos from both the core code developers for more details.
Please note that some of the commands have changed and have been updated compared to the original videos, please see them under the different sections for each script / process that you can run.
- [Hashlips - Youtube](https://www.youtube.com/playlist?list=PLvfQp12V0hS3AVImYdMNfkdvRtZEe7xqY)
- [codeSTACKr - Youtube](https://youtu.be/AaCgydeMu64)


## TIP / Contributions Address
If you feel that this has benefitted you in any way and would like to make a contribution towards The Peanut Gallery And Co, then please use the following MetaMask wallet address:
- `0x5cE5D823f4bD8Ec610868fBa65832B479152C7E1`


## NFT Collection
If you would like to support my NFT collection, please take a look at the below.
- [Steak-Bites Collection On Opensea](https://opensea.io/collection/steak-bites)
![Banner V4](https://user-images.githubusercontent.com/52892685/149317695-82707703-a8db-4e17-8dc2-98d59aefae2e.png)


## Run Below Command To Install Depedencies
- `npm install`

**Please note that if you have a Mac with a M1 chip and you run into issues with npm install, then please try to install Node.js version 14 instead of the latest Node version and try the npm install again**


## Code Repo Guide
- [Updates & Fixes](#updates--fixes)
- [How To Use The Codebase](#how-to-use-the-codebase)
     - [1. Download and unzip the main branch of this repo](#1-download-and-unzip-the-main-branch-of-this-repo)
          - [a. Extracted folder contains another folder called create-and-mint-nft-collection](#a-extracted-folder-contains-another-folder-called-create-and-mint-nft-collection)
          - [b. Extracted folder contains all the files as in step 2](#b-extracted-folder-contains-all-the-files-as-in-step-2)
     - [2. Run the dependency npm commands in the unzipped folder](#2-run-the-dependency-npm-commands-in-the-unzipped-folder)
     - [3. Update The Main Configuration File For The Art Engine](#3-update-the-main-configuration-file-for-the-art-engine)
          - [a. If you are planning on using Solana, then update this section](#a-if-you-are-planning-on-using-solana-then-update-this-section)
          - [b. Update your layer configurations](#b-update-your-layer-configurations)
          - [c. Update the width and height of your canvas](#c-update-the-width-and-height-of-your-canvas)
          - [d. Update the extra metadata that you want to add into your NFT's metadata. You can remove both fields inside of this extraMetadata object or add more if you like](#d-update-the-extra-metadata-that-you-want-to-add-into-your-nfts-metadata-you-can-remove-both-fields-inside-of-this-extrametadata-object-or-add-more-if-you-like)
     - [4. Configure The NFT Creation Details](#4-configure-the-nft-creation-details)
     - [5. Configure The NFTPort Account Details And API Limits - Only modify this if you are using NFTPort for uploading](#5-configure-the-nftport-account-details-and-api-limits---only-modify-this-if-you-are-using-nftport-for-uploading)
     - [6. Create Image Layers](#6-create-image-layers)
     - [7. Art Engine](#7-art-engine)
          - [a. Creation / Build](#a-creation--build)
          - [b. Additional Art Creation Options](#b-additional-art-creation-options)
          - [c. Rarity Information](#c-rarity-information)
          - [d. Provenance Information](#d-provenance-information)
          - [e. Generate metadata from images (Experimental)](#e-generate-metadata-from-images-experimental)
     - [8. Update NFT's Info (Description And Name)](#8-update-nfts-info-description-and-name)
     - [9. Update NFTs For Reveal - Generic Image Until Purchased, Then Only Reveal NFT](#9-update-nfts-for-reveal---generic-image-until-purchased-then-only-reveal-nft)
     - [10. Uploading Files (Images and Metadata)](#10-uploading-files-images-and-metadata)
          - [a. Pinata Or Similar Service](#a-pinata-or-similar-service)
          - [b. NFTPort](#b-nftport)
     - [11. Create Wallet Edition Combo](#11-create-wallet-edition-combo)
     - [12. ERC1155 Batch IPFS Metas Migration](#12-erc1155-batch-ipfs-metas-migration)
     - [13. Minting NFTs](#13-minting-nfts)
     - [14. Checking NFT Mint Files For Issues](#14-checking-nft-mint-files-for-issues)
     - [15. Re-Mint Failed NFTs](#15-re-mint-failed-nfts)
     - [16. Check Your Work On The Marketplace](#16-check-your-work-on-the-marketplace)
     - [17. Refresh NFT Metadata For Opensea](#17-refresh-nft-metadata-for-opensea)
     - [18. Sell NFTs Opensea](#18-sell-nfts-on-opensea)


## Commands
- [Art Engine Commands](#art-engine-commands)
     - [Build Command](#build-command)
     - [Create_Provenance Command](#create_provenance-command)
     - [Generate_Metadata Command](#generate_metadata-command)
     - [Pixelate Command](#pixelate-command)
     - [Preview Command](#preview-command)
     - [Preview_Gif Command](#preview_gif-command)
     - [Rarity Command](#rarity-command)

- [Custom Commands](#custom-commands)
     - [Batch_Ipfs_Metas_Migration Command](#batch_ipfs_metas_migration-command)
     - [Check_Mints Command](#check_mints-command)
     - [Check_Mints_Batch Command](#check_mints_batch-command)
     - [Create_Wallet_Edition_Combo Command](#create_wallet_edition_combo-command)
     - [Rarity_Md Command](#rarity_md-command)
     - [Rarity_Rank Command](#rarity_rank-command)
     - [Update_Image_Info Command](#update_image_info-command)
     - [Update_Json_To_Generic_Meta Command](#update_json_to_generic_meta-command)
     - [Update_Metadata_Info Command](#update_metadata_info-command)
     - [Update_Nft_Info Command](#update_nft_info-command)

- [NFTPort Commands](#nftport-commands)
     - [Mint_Batch Command](#mint_batch-command)
     - [Mint_Item Command](#mint_item-command)
     - [Mint_Range Command](#mint_range-command)
     - [Mint Command](#mint-command)
     - [Remint Command](#remint-command)
     - [Remint_Batch Command](#remint_batch-command)
     - [Reveal Command](#reveal-command)     
     - [UploadFiles Command](#uploadfiles-command)
     - [UploadMetas Command](#uploadmetas-command)
     - [UploadMetas_Directory Command](#uploadmetas_directory-command)

- [Opensea Commands](#opensea-commands)
     - [Refresh_Metadata Command](#refresh_metadata-command)
     - [Sell_Nfts Command](#sell_nfts-command)


## ERC721 Examples
- [EXAMPLE - NO REVEAL (ERC721)](#example---no-reveal-erc721)
     - [Download Repo And Extract](#download-repo-and-extract)
     - [Install Packages](#install-packages)
     - [Update src/config.js](#update-srcconfigjs)
     - [Update constants/account_details.js](#update-constantsaccount_detailsjs)
     - [Update constants/nft_details.js](#update-constantsnft_detailsjs)
     - [Art Engine - Build](#art-engine---build)
     - [Upload Files](#upload-files)
     - [Upload Metas](#upload-metas)
     - [Mint](#mint)

- [EXAMPLE - REVEAL (ERC721)](#example---reveal-erc721)
     - [Download Repo And Extract](#download-repo-and-extract-1)
     - [Install Packages](#install-packages-1)
     - [Update src/config.js](#update-srcconfigjs-1)
     - [Update constants/account_details.js](#update-constantsaccount_detailsjs-1)
     - [Update constants/nft_details.js](#update-constantsnft_detailsjs-1)
     - [Art Engine - Build](#art-engine---build-1)
     - [Update JSON To Generic Meta](#update-json-to-generic-meta)
     - [Upload Files](#upload-files-1)
     - [Upload Metas - This will upload your json directory's files](#upload-metas---this-will-upload-your-json-directorys-files)
     - [Rename ipfsMetas directory](#rename-ipfsmetas-directory)
     - [Update constants/account_details.js](#update-constantsaccount_detailsjs-2)
     - [Upload Metas - This will upload your genericJSON directory's files](#upload-metas---this-will-upload-your-genericjson-directorys-files)
     - [Mint - This will mint your unrevealed NFTs' metadata](#mint---this-will-mint-your-unrevealed-nfts-metadata)
     - [Manually Update Metadata After Purchase](#manually-update-metadata-after-purchase)


## ERC1155 Examples
 - [EXAMPLE - NO REVEAL (ERC1155)](#example---no-reveal-erc1155)
     - [Download Repo And Extract](#download-repo-and-extract-2)
     - [Install Packages](#install-packages-2)
     - [Update src/config.js](#update-srcconfigjs-2)
     - [Update constants/account_details.js](#update-constantsaccount_detailsjs-3)
     - [Update constants/nft_details.js](#update-constantsnft_detailsjs-2)
     - [Art Engine - Build](#art-engine---build-2)
     - [Upload Files](#upload-files-2)
     - [Upload Metas](#upload-metas-1)
     - [Batch IPFS Metas Migration](#batch-ipfs-metas-migration)
     - [Mint Batch - This will mint your unrevealed NFTs' metadata](#mint-batch---this-will-mint-your-unrevealed-nfts-metadata)

- [EXAMPLE - REVEAL (ERC1155)](#example---reveal-erc1155)
     - [Download Repo And Extract](#example---reveal-erc1155)
     - [Install Packages](#install-packages-3)
     - [Update src/config.js](#update-srcconfigjs-3)
     - [Update constants/account_details.js](#update-constantsaccount_detailsjs-4)
     - [Update constants/nft_details.js](#update-constantsnft_detailsjs-3)
     - [Art Engine - Build](#art-engine---build-3)
     - [Update JSON To Generic Meta](#update-json-to-generic-meta-1)
     - [Upload Files](#upload-files-3)
     - [Upload Metas - This will upload your json directory's files](#upload-metas---this-will-upload-your-json-directorys-files-1)
     - [Rename ipfsMetas directory](#rename-ipfsmetas-directory-1)
     - [Update constants/account_details.js](#update-constantsaccount_detailsjs-5)
     - [Upload Metas - This will upload your genericJSON directory's files](#upload-metas---this-will-upload-your-genericjson-directorys-files-1)
     - [Batch IPFS Metas Migration](#batch-ipfs-metas-migration-1)
     - [Mint Batch - This will mint your unrevealed NFTs' metadata](#mint-batch---this-will-mint-your-unrevealed-nfts-metadata-1)
     - [Manually Update Metadata After Purchase](#manually-update-metadata-after-purchase-1)


## Error Examples
- [EXAMPLE - DNA EXISTS AND NEED MORE LAYERS TO GROW EDITION](#example---dna-exists-and-need-more-layers-to-grow-edition)
- [EXAMPLE - FILE ALREADY UPLOADED](#example---file-already-uploaded)
- [EXAMPLE - UPLOAD GENERIC METAS WITHOUT CREATING GENERIC METAS FILES](#example---upload-generic-metas-without-creating-generic-metas-files)
- [EXAMPLE - METADATA ALREADY UPLOADED OUTPUT](#example---metadata-already-uploaded-output)
- [EXAMPLE - MINT FAILED, USING CHECK_MINTS AND REMINT](#example---mint-failed-using-check_mints-and-remint)
- [EXAMPLE - MINT BATCH FAILED, USING CHECK_MINTS_BATCH AND REMINT_BATCH](#example---mint-batch-failed-using-check_mints_batch-and-remint_batch)
- [EXAMPLE - EDITION ALREADY MINTED](#example---edition-already-minted)
- [EXAMPLE - CONTRACT ALREADY HAS THE GIVEN TOKEN ID](#example---contract-already-has-the-given-token-id)


## Video Examples
- [Example - Applications Setup](https://youtube.com/playlist?list=PL0iNFQ9GSS_poH0PTJpb1k1v3xdED2tTc)
- [Example - NFTPort Account Setup](https://youtube.com/playlist?list=PL0iNFQ9GSS_ooNtgvoAqKzxlHzSXAHJpT)
- [Example - Applications Setup](https://youtube.com/playlist?list=PL0iNFQ9GSS_rvq9XbNjObRJ6CN36n6KS6)

<br/>


## UPDATES & FIXES


### Added Opensea Selling Script
Added a new script `utils/opensea/sell_nfts.js` that will allow users to sell NFTs between two edition numbers (inclusive) to be put up for sale if the user owns the NFTs. This functionality uses Puppeteer and Chainsafe's Dappeteer, so please use at your own discretion as you will need to make use of your seed phrase for this functionality to work. [Feature - Opensea Polygon Script To Auto Sell NFTs](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/42) and [Feature - Opensea Polygon Script To Auto Sell NFTs Additional Fields](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/47)


### Added Start Collection Edition Setting
Users can now set at which edition number the collection creation process should start add. The `startCollectionEditionFrom` setting can be found in the `constants/nft_details.js` file.


### Added metadata filtration rule - Dependency Traits
Users have a new metadata filtration configuration option
- Dependency Traits - Set the combination of traits that needs to be generated together to enforce certain combinations.


### Added NFTPort UploadMetas Directory API
Added a new script that will allow users to upload the json files in a directory in a single API call instead of individual API calls for each JSON file. This should typically be used with collection contracts on NFTPort or if a single CID is needed for the JSON files. [NFTPort API - Upload Metadata Directory To IPFS](https://docs.nftport.xyz/docs/nftport/b3A6NDMwNTE5ODY-upload-metadata-directory-to-ipfs)


<br/>


## How To Use The Codebase
Below is a rough guideline of the order in which the processes can be used.

### 1. Download and unzip the main branch of this repo
Please note that when extracting the code base, there's two possibilities for the extracted folder. Please always make sure that you are opening the folder in VS Code or your terminal which matches the folder structure in step 2.

#### a. Extracted folder contains another folder called create-and-mint-nft-collection
If this is the case when extracting your folder, then be sure to "cd" or move into that folder before running step 2's install commands, otherwise you will receive module errors and the npm installs won't work and your build and upload commands will not work correctly.
<img width="1040" alt="Screenshot 2022-01-19 at 15 44 26" src="https://user-images.githubusercontent.com/52892685/150142674-9371b030-5d2e-442d-88c4-aa6df8604eea.png">


#### b. Extracted folder contains all the files as in step 2
No need for any extra steps, you can start with step 2 where you run the npm install commands.
<img width="990" alt="Screenshot 2022-01-19 at 15 46 52" src="https://user-images.githubusercontent.com/52892685/150143042-91287da1-7d54-4a3f-8ced-50915cacdcde.png">


### 2. Run the dependency npm commands in the unzipped folder
Ensure that you are in this diretory before running the npm install commands, otherwise some of your commands will not work correctly.

Example of the contents of the root folder before running the installs:
<img width="1021" alt="Screenshot 2022-01-13 at 12 45 28" src="https://user-images.githubusercontent.com/52892685/149315776-324ddb37-7942-4369-86ee-7ce5d664a0e8.png">

Example of the contents of the root folder after running the installs:
<img width="1009" alt="Screenshot 2022-01-13 at 12 46 51" src="https://user-images.githubusercontent.com/52892685/149315979-f758dcb3-b6c0-409e-9ff0-9c01b0672150.png">


### 3. Update The Main Configuration File For The Art Engine
Update the `src/config.js` file with the different settings for your generative art collection. 
Please watch the videos linked earlier on how to configure the Art Engine.

Modify the following parts at the very least, below are just sample values that I used in a demo.

#### a. If you are planning on using Solana, then update this section
<img width="1134" alt="Screenshot 2022-01-13 at 12 47 25" src="https://user-images.githubusercontent.com/52892685/149316077-8479678d-57fc-418f-9a91-4d74c26e8b59.png">

#### b. Update your layer configurations
- Update your folder names, order in which they need to be processed and the number of images to create
- Optionally add maximum repeatability filtration rule in for the layers - Please see [Maximum Repeatability Feature](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/16) and [Layer Item Maximum Repeatability Settings](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/20)
- Optionally add layer combination filtration rules in for the layers - Please see [Layer Combination Exclusion Feature](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/15)
- Optionally add layer dependent traits filtration rules in for the layers - Please see [Layer Trait Dependencies Feature](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/29)

*Example of default configuration along with maximum repeatability and layer compatibility*

![Screenshot 2022-03-15 at 01 10 17](https://user-images.githubusercontent.com/52892685/158283474-cba5a3cd-011c-4e1b-8371-69093f5dff9d.png)


#### c. Update the width and height of your canvas
<img width="228" alt="Screenshot 2022-01-13 at 12 48 07" src="https://user-images.githubusercontent.com/52892685/149316206-fb068e39-274e-45d2-8376-0eeb16586109.png">


#### d. Update the extra metadata that you want to add into your NFT's metadata. You can remove both fields inside of this extraMetadata object or add more if you like
<img width="1305" alt="Screenshot 2022-01-13 at 12 49 21" src="https://user-images.githubusercontent.com/52892685/149316407-bc9d5970-832c-450a-8e5a-9cd8efa430a7.png">


### 4. Configure The NFT Creation Details
Update the `constants/nft_details.js` file with the details that you want to be added to your metadata for your generative art collection.

- `description` - The description that will be added to each of your NFTs
- `namePrefix` - The name prefix that will be added for each of your NFTs. Ex. Steaks #1, Steaks #2
- `imageFilesBase` - Pinned IPFS CID when making use of a service like Pinata. Ex. QmP12prm2rp1omr1Ap2orm1oprm12FQWFQOFOGdnasnsda . Only update this if you are planning to upload the files via a service other than NFTPort where you host a single URL / CID base.
- `metaDataJSONFilesBase` - Pinned IPFS CID when making use of a service like Pinata. Ex. QmP12prm2rp1omr1Ap2orm1oprm12FQWFQOFOGdnasnsda . Only update this if you are planning to upload the files via a service other than NFTPort where you host a single URL / CID base.
- `ignoreExactBlankName` - This value is a boolean with a value of false or true. If true, then any layer that contains only the name "blank" with a rarity character and value in the metadata will be skipped and not added to the properties of the NFT. When set to false, then the information will be added to the metadata and added to the properties of the NFT.
- `genericTitle` - Replace with what you want the generic titles to say. Only change if you are planning on using NFT reveal and want a different name for your NFTs.
- `genericDescription` - Replace with what you want the generic descriptions to say. Only change if you are planning on using NFT reveal and want a different name for your NFTs.
- `genericURLs` - Replace with the image URLs that your generic NFTs should show. Only change if you are planning on using NFT reveal and want a different name for your NFTs.
- `ignoreAllNamesWithBlank` - This value is a boolean with a value of false or true. If true, then any layer item that contains the word blank within the filename will be skipped from being added to the metadata information. When set to false, then the information will be added to the metadata. E.x white_eyes_blank #100.png will be added to metadata if set to false, while being skipped if true.
- `startCollectionEditionFrom` - This value is used to determine from which edition number the collection creation should start. It is set to `'1'` as default, which will start Sol collections at 0, while starting Eth collections at 1. If you plan on using Collection contracts from NFTPort, then be sure to set this value to `'0'` before generating your art work.

Modify only the parts that you will be using and keep the rest as set by default.
For example, if you are planning on using NFTPort for your file and metadata uploads, then do not modify the `imageFilesBase` and `metaDataJSONFilesBase` fields. If you are planning on not doing a reveal NFT collection and simply have everything revealed, then do not modify the `genericTitle`, `genericDescription` and `genericURLs` fields. If you want your NFT properties on Opensea to show, for example "Blank #15.png", then set the `ignoreExactBlankName` value to false. If you want to remove all "blank" layer items from your NFT properties on Opensea, for example "white_eyes_blank #10.png", then set the `ignoreAllNamesWithBlank` value to true.

Example configuration:
<img width="1351" alt="Screenshot 2022-03-17 at 21 50 54" src="https://user-images.githubusercontent.com/52892685/158884234-3596584e-a1d6-4bb6-9deb-ca8bca5bb1e1.png">


### 5. Configure The NFTPort Account Details And API Limits - Only modify this if you are using NFTPort for uploading
Update the `constants/account_details.js` file with the NFTPort account details. These will only be used with the NFTPort scripts. This will be needed if you are uploading files or minting via NFTPort. Please ensure that your NFT contract was created with the `metadata_updatable` variable set to true as this allows for NFT metadata updates to be made and is needed if you are planning on doing NFT reveals after purchases. If not, then you can't change your NFT data and you will need to burn the NFT from the contract to remove it. This will cost you funds / tokens, so make sure you create your contract correctly!

- `auth` - Add your APIKey here that the NFTPort team will provide. Ex. orm1or1-efe1-112a-cccd-kqwfkfmk
- `contract_address` - Add your contract address here, not your transaction hash. After creating a contract on NFTPort, retrieve the contract address via the APIs. Ex. 0xfe81cm1l28b21753ebe117c84als2d6588e150ff
- `mint_to_address` - Add your wallet address here that will be the owner of the minted NFTs. Ex. 0x5cE5D823f4bD8Ec610293fBa65832B479152C7E1
- `chain` - Add the chain where the NFTs will be minted to here. At the time of writing, "polygon" and "rinkeby" are possible values.
- `max_rate_limit` - This will rate limit your API calls towards the NFTPort platform. Be sure to set it according to what is allowed for your APIKey. Ex. '1'
- `numberOfRetries` - This is the retry count that your NFTPort API calls will attempt when not receiving a successful response from the API. It is not advised to make the retry count too high.  Ex. '3'
- `timeout` - This is the waiting time in between API calls when errors arise on the APIs. This has been disabled at the moment as it causes the scripts to hang at times. E.x. 5000 = 5 seconds.
- `mint_range` - If you only want to mint a specific range of editions, e.x everything between editions 5 and 10.
- `mint_item` - If you only want to mint a specific edition, e.x 1.
- `uploadGenericMeta` - If you are planning on using a reveal, then set this value to true, otherwise keep this as false. When it is true, then the uploadMetas files will read from the genericJSON directory to upload the metadata. If set to false (default), then it will read from the json directory which contains your revealed items.
- `batch_mint_size` - The number of NFTs that are minted per batch_mint. Maximum is 50 NFTs per batch_mint. This is only applicable to ERC1155 contracts, not ERC721.
- `batch_mint_nft_amount` - The number of times that each NFT will be minted. For example, if set to 5, then each NFT edition can be sold 5 times. This is only applicable to ERC1155 contracts, not ERC721.

Modify only the parts that you will be using and keep the rest as set by default.
For example, if you are having issues and want more retries on the API or a higher rate limit, only then modify those fields. If you are planning on only minting a single edition or a range of editions, only then modify those fields. If you are planning on doing a reveal, only then modify the `uploadGenericMeta` field. If you are making use of ERC1155 contract, then update the `batch_mint_size` and `batch_mint_nft_amount` fields to change the number of NFTs per mint and the number of times that each NFT can be sold for.

Example configuration:
<img width="1341" alt="Screenshot 2022-01-21 at 15 15 22" src="https://user-images.githubusercontent.com/52892685/150533194-886a63e5-14f2-46f2-bee1-1428e11144d2.png">


### 6. Create Image Layers
Create your different art layers, keeping all of them at the same Canvas size and ensuring they are all exported as .png files. 


### 7. Art Engine
Review the Hashlips videos on what all of the configuration items in the `src/config.js` file means and what you need to set them to. 
All of the `Art Engine Commands` make use of this configuration file along with the `constants/nft_details.js` file.

Only run the commands from sections a, b and c that you would like to make use of.

#### a. Creation / Build
Use the `Art Engine - Build Command` below to create your generative art collection along with their metadata json files.

#### b. Additional Art Creation Options
- Use the `Art Engine - Pixelate Command` below to create a pixelated art collection from your previous generative art collection.
- Use the `Art Engine - Preview Command` below to create a preview of your generative art collection by combining a few of the images into a single image.
- Use the `Art Engine - Preview_Gif Command` below to create a preview_gif of your generative art collection by combining a few of the images into a single gif that loops through some of your images.

#### c. Rarity Information
Use the `Art Engine - Rarity Command` below to generate a JSON output to the terminal that will show you how your layers will be distributed.

Use the `Custom - Rarity_Md Command` below to generate a JSON file (`_metadata_with_rarity.json`) in the build/json/ directory. This will add a `rarity_score` key to each attribute as well as a `total_rarity_score` and `rank` for each NFT edition. Use the `Custom - Rarity_Rank Command` below to pull information from the `_metadata_with_rarity.json` file, like the top X editions or the rank of a specific NFT edition. 

**Example of top 20 editions from my collection**
````
create-and-mint-nft-collection roebou$ npm run rarity_rank

> create-and-mint-nft-collection@1.6.1 rarity_rank
> node utils/custom/rarity_rank.js

Enter 1 to get top ## NFTs by rarity or 2 to get a specific NFTs rarity: 1
Enter the number of NFTs you want to get: 20
[
  { name: 'Steak Bite #8237', rank: 1, total_rarity_score: 110.84 },
  { name: 'Steak Bite #5552', rank: 2, total_rarity_score: 110.66 },
  { name: 'Steak Bite #342', rank: 3, total_rarity_score: 105.64 },
  { name: 'Steak Bite #7612', rank: 4, total_rarity_score: 105.08 },
  { name: 'Steak Bite #5086', rank: 5, total_rarity_score: 103.83 },
  { name: 'Steak Bite #1093', rank: 6, total_rarity_score: 103.45 },
  { name: 'Steak Bite #2898', rank: 7, total_rarity_score: 101.94 },
  { name: 'Steak Bite #3326', rank: 8, total_rarity_score: 100.11 },
  { name: 'Steak Bite #4257', rank: 9, total_rarity_score: 98.16 },
  { name: 'Steak Bite #435', rank: 10, total_rarity_score: 96.26 },
  { name: 'Steak Bite #8675', rank: 11, total_rarity_score: 96.06 },
  { name: 'Steak Bite #1288', rank: 12, total_rarity_score: 95.43 },
  { name: 'Steak Bite #2966', rank: 13, total_rarity_score: 95.16 },
  { name: 'Steak Bite #7232', rank: 14, total_rarity_score: 95 },
  { name: 'Steak Bite #9128', rank: 15, total_rarity_score: 94.62 },
  { name: 'Steak Bite #6542', rank: 16, total_rarity_score: 94.58 },
  { name: 'Steak Bite #3942', rank: 17, total_rarity_score: 94.52 },
  { name: 'Steak Bite #9162', rank: 18, total_rarity_score: 94.41 },
  { name: 'Steak Bite #3864', rank: 19, total_rarity_score: 93.61 },
  { name: 'Steak Bite #1150', rank: 20, total_rarity_score: 93.46 }
]
create-and-mint-nft-collection roebou$
````

#### d. Provenance Information
Use the `Art Engine - Create_Provenance Command` below to generate two new JSON files within the `build/json` directory. To read up more on Provenance and how it can be used in your NFT Collections, please see the following [Medium Link](https://medium.com/coinmonks/the-elegance-of-the-nft-provenance-hash-solution-823b39f99473)

- `concatedHash.json` - This is a string that contains the concated hash string of all image URIs.
- `provenanceHash.json` - This is the final proof of your collection. This is a hash based on the `concatedHash.json` file's contents.

`provenanceHash.json` structure:
```Javascript
{
"provenance": "",
collection: [
 {
 "tokenId": ,
      "image": "",
      "imageHash": "",
      "traits": [],
 }],
}
```


#### e. Generate metadata from images (Experimental)
Use the `Art Engine - Generate_Metadata Command` below to generate a json file for each of the image files in the `build/images` folder.

**Please use this with caution as this will delete your `build/json` directory and generate a new directory with new files in it. If you would like to test this out, please be sure to backup your `build/json` directory first if you have one.**


### 8. Update NFT's Info (Description And Name)
Use the `Custom - Update_Nft_Info Command` below to update all NFT JSON files with the new `namePrefix` and `description` from the `constants/nft_details.js` file.

Please note that this should be run before you run the `NFTPort - UploadFiles Command`, `NFTPORT - UploadMetas Command`, `NFTPORT - UploadMetas_Directory Command` and `NFTPORT - Mint Command` commands.
Use this only if you want to use a different name and description for your NFTs compared to what got generated with the `Art Engine - Build Command` command.


### 9. Update NFTs For Reveal - Generic Image Until Purchased, Then Only Reveal NFT
Use the `Custom - Update_Json_To_Generic_Meta Command` below to update all NFT files with the `genericTitle`, `genericDescription` and `genericURLs` values set in the `constants/nft_details.js` file. This will be shown as your NFT's details and picture before a purchase. 

This process will create a new `genericJSON` directory where the `_metadata.json` file will be located along with each file's generic JSON object file. Remember to change your `uploadGenericMeta` key's value to `true` in the `constants/account_details.js` file before making use of the UploadMetas and UploadMetas_Directory scripts so that it will upload the files in this directory instead of the normal `json` directory if you are making use of reveals.

**Please remember that your contract needs to be updateable to use this, otherwise this image will stay the image of your NFT, before and after purchase.**

**Please remember to update the genericURLs field with the URLs where the generic images are located. You can upload your generic image files to IPFS by simply using the NFTPort API via the frontend to upload a file and receive an IPFS URL that you can use within the genericURLs field.**


### 10. Uploading Files (Images and Metadata)
There are two options that you can follow to upload your images and json files onto IPFS. Option 1 would be to go via a service like Pinata that gives a static CID to be used, while Option 2 would be to go directly via NFTPort, however, the CID will be unique for each file.

#### a. Pinata Or Similar Service
Create an account on [Pinata](https://app.pinata.cloud/) and then upload your images folder. Please note that once you have uploaded your folder, you can't add or remove any files from there. From there copy the CID into the `constants/nft_details.js` file against the `imageFilesBase` key.

Use the `Custom - Update_Image_Info Command` below to update the json files for each NFT.
This process will `only` update the `file_url` and `image` fields within the json file as well as in the `_metadata.json` file.

Upload the json directory onto Pinata and copy the CID into the `constants/nft_details.js` file against the `metaDataJSONFilesBase` key. This should be either of your `json` or `genericJSON` directories, depending on whether you are doing a reveal or not. Just a note, it would make sense to get both of your json directories uploaded if you are doing a reveal so that you can simply update the metadata of your unrevealed NFT, but please see the section on NFT reveal steps to follow in the `EXAMPLE - REVEAL (ERC721)` and `EXAMPLE - REVEAL (ERC1155)` examples below.

Use the `Custom - Update_Metadata_Info Command` below to update the json files for each NFT.
This process will create a new `ipfsMetas` folder, update each NFT json file with a `metadata_uri` field and create a `_ipfsMetas.json` file. All the new json files will be added to the `ipfsMetas` folder.

#### b. NFTPort
Create an account on [NFTPort](https://www.nftport.xyz/) and get an APIKey. Be sure to check your rate limit of your account as well as the amount of NFTs that you can upload with your APIKey's access levels. Update your account's details in the `constants/account_details.js` file.

Use the `NFTPort - UploadFiles Command` below to upload the image files to IPFS. This process will also update the json file for each NFT with the IPFS URL and add it into the `file_url` and `image` fields. This process will `only` update the `file_url` and `image` fields within the json file as well as the corresponding object in the `_metadata.json` file.

Use the `NFTPort - UploadMetas Command` or `NFTPORT - UploadMetas_Directory Command` below to upload the json metadata files for each NFT to IPFS and then create a `ipfsMetas` folder with an `_ipfsMetas.json` file and a json file for every NFT, containing the upload API response.
The new json files in the `ipfsMetas` directory will now contain a `metadata_uri` field and this has also been added to each object inside the `_ipfsMetas.json` file.

`Important` - Should you wish to do a reveal, please remember that your contract should allow for updates to your NFT files. You also need to update the `uploadGenericMeta` key's value to `true` in the `constants/account_details.js` file so that the genericJSON directory's metadata will be used instead of the json directory. Please see the section on NFT reveal steps to follow in the `EXAMPLE - REVEAL (ERC721)` and `EXAMPLE - REVEAL (ERC1155)` examples below.


### 11. Create Wallet Edition Combo
If you would like to mint your editions to different wallets, then you need to populate the account_details.js file's walletMintList with the wallet address and nft edition count. Once this is done, then run the `Custom - Create_Wallet_Edition_Combo Command`, which will generate a new `_walletAddressMintList.json` in the ipfsMetas directory. When you run the the `ERC1155 Batch IPFS Metas Migration` or `Minting NFTs` steps, then it will attempt to get the specific edition's wallet address that it needs to mint towards. If it can't find the `_walletAddressMintList.json` file or the edition is not in the file, then the mint process will default back to the mint_to_address field in the account_details.js file.


### 12. ERC1155 Batch IPFS Metas Migration
If you would like to make use of batch minting against an ERC1155 contract, you need to run the `Custom - Batch_Ipfs_Metas_Migration` script which will create a new `batchIPFSMetas` directory and it will create numbered json files, for example `1.json` which will contain a list of tokens for that specific batch to be minted, and a new `_batchIPFSMetas.json` file which will be a combined json file of all the numbered json files. The `NFTPort - Mint_Batch Command` will use this file these files to mint the token batches.

Before you use the `Custom - Batch_Ipfs_Metas_Migration` script, please be sure to update the `batch_mint_size` and `batch_mint_nft_amount` key's values to what your requirement is. By default, it is set to 50 for the `batch_mint_size` key and 1 for the `batch_mint_nft_amount` key.


### 13. Minting NFTs
- Use the `NFTPort - Mint_Batch Command` below to start minting against an ERC1155 contract where your mints will happen in batches.
- Use the `NFTPort - Mint Command` below to start minting against an ERC721 contract where your mint will happen individually.
- Use the `NFTPort - Mint_Range Command` below to start minting against an ERC721 contract for a range of NFTs between specific editions.
- Use the `NFTPort - Mint_Item Command` below to start minting against an ERC721 contract for a specific NFT edition.

Before you use the `NFTPort - Mint_Range Command` script, please be sure to update the `mint_range` key's values to the `from` and `to` edition numbers that you would like to attempt to mint. Please note that both of these numbers are `inclusive`.

Before you use the `NFTPort - Mint_Item Command` script, please be sure to update the `mint_item` key's values to the edition number that you would like to attempt to mint.

Before you use the `NFTPort - Mint_Batch Command` script, please be sure to run the `Custom - Batch_Ipfs_Metas_Migration` script.


### 14. Checking NFT Mint Files For Issues
- Use the `Custom - Check_Mints Command` below to start checking each mint file to determine if there are any issues with the minted files for ERC721 contract files (individual files). 
- Use the `Custom - Check_Mints_Batch Command` below to start checking each mint file to determine if there are any issues with the minted files for ERC1155 contract files (batch files). 

The check performs validation of the issues experienced in the `Minting NFTs` section and writes out the json files into a `failedMints` directory. 

The checks that this script performs to determine if a NFT mint has failed are done in all of the minting scripts before a mint is attempted for a specific file. The reason for adding this script is so that if you have 10 000 NFTs that you minted and you simply run one of the minting scripts again, then it will first scan the relevant file (depending on the mint command used) and then perform mint. This means if you use the mint script again, it will go through all 10 000 items, every time you run it. Should you use batch minting, then less files will be scanned, depending on your batch sizes.

The check mints scripts will go through the files once off, check all of their data and provide a list of items that need to be re-minted with the `NFTPort - Remint Command` or `NFTPort - Remint_Batch Command`, which will only scan the files that got picked up by the check mints processes.

**Please note that every time this runs, it clears out the folder and starts again.**

**Please note that this process can take time to complete as it runs through every minted json file.**


### 15. Re-Mint Failed NFTs
- Use the `NFTPort - ReMint Command` below to start re-minting each of the json files in the `failedMints` directory for ERC721 (Individual files) contract files. 
- Use the `NFTPort - ReMint_Batch Command` below to start re-minting each of the json files in the `failedMints` directory for ERC1155 (batch files) contract files.

This process will write out a newly minted file in the `reMinted` directory as well as update the json file in the original `minted` directory. Due to this, a backup folder will be created every time this process runs with the date to keep a backup of the json file in the minted directory at the time of running this process just as a safe guard so that you have access to the original information or how the information changed in between your processing.


### 16. Check Your Work On The Marketplace
You are done with your minting process!
Well done!
Go and check out your mints on your marketplace and refresh the metadata where needde.

GOOD LUCK!


### 17. Refresh NFT Metadata For Opensea
Go to the utils/opensea/refresh_metadata.js file and update the `START_EDITION` and `END_EDITION` fields. Please make sure that the contract address that you are trying refresh has been set for the `contract_address` field in the `constants/account_details.js` file.

Use the  `Opensea - Refresh_Metadata Command` below to start the refresh of metadata for each NFT edition between your start and end editions.

**Please note this process will be time consuming for large editions.**


### 18. Sell NFTS On Opensea
Go to the utils/opensea/sell_nfts.js file and update the `START_EDITION`, `END_EDITION`, `NFT_PRICE`, `DROPDOWN_OPTION`, `DATE_PICK_SKIP`, `START_HOUR`, `START_MINUTE`, `END_HOUR`, `END_MINUTE` and potentially `seed` fields. Please make sure that the contract address that you are trying sell NFTs for has been set in the `contract_address` field in the `constants/account_details.js` file as well as that the `chain` value is correct for the specific contract address.

Use the  `Opensea - Sell_Nfts Command` below to start the putting each NFT edition up for sale between your start and end editions for the given price.

[Feature - Opensea Polygon Script To Auto Sell NFTs](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/42) and [Feature - Opensea Polygon Script To Auto Sell NFTs Additional Fields](https://github.com/thepeanutgalleryandco/create-and-mint-nft-collection/issues/47)

**Please read the warning very carefully within the the sell_nfts.js file with regards to the seed field.**
**Please note that this script will only work with the Polygon network**
**Please note this process will be time consuming for large editions.**


## Art Engine Commands
### Build Command
- npm run build


### Create_Provenance Command
- npm run create_provenance
- node utils/art_engine/create_provenance.js 


### Generate_Metadata Command
- npm run generate_metadata
- node utils/art_engine/generate_metadata.js 


### Pixelate Command
- node utils/art_engine/pixelate.js
- npm run pixelate


### Preview Command
- node utils/art_engine/preview.js
- npm run preview


### Preview_Gif Command
- node utils/art_engine/preview_gif.js
- npm run preview_gif


### Rarity Command
- node utils/art_engine/rarity.js
- npm run rarity


## Custom Commands
Use the following command from the code's root directory.

### Batch_Ipfs_Metas_Migration Command
- node utils/custom/batch_ipfs_metas_migration.js
- npm run batch_ipfs_metas_migration


### Check_Mints Command
- node utils/custom/check_mints.js
- npm run check_mints


### Check_Mints_Batch Command
- node utils/custom/check_mints_batch.js
- npm run check_mints_batch


### Create_Wallet_Edition_Combo Command
- node utils/custom/create_wallet_edition_combo.js
- npm run create_wallet_edition_combo


### Rarity_Md Command
- node utils/custom/getRarity_fromMetadata.js
- npm run rarity_md


### Rarity_Rank Command
- node utils/custom/rarity_rank.js
- npm run rarity_rank


### Update_Image_Info Command
- node utils/custom/update_image_info.js
- npm run update_image_info


### Update_Json_To_Generic_Meta Command
- node utils/custom/update_json_to_generic_meta.js
- npm run update_json_to_generic_meta


### Update_Metadata_Info Command
- node utils/custom/update_metadata_info.js
- npm run update_metadata_info


### Update_Nft_Info Command
- node utils/custom/update_nft_info.js
- npm run update_nft_info


## NFTPort Commands
Use the following command from the code's root directory.

### Mint_Batch Command
- node utils/nftport/mint_batch.js
- npm run mint_batch


### Mint_Item Command
- node utils/nftport/mint_item.js
- npm run mint_item


### Mint_Range Command
- node utils/nftport/mint_range.js
- npm run mint_range


### Mint Command
- node utils/nftport/mint.js
- npm run mint


### Remint Command
- node utils/nftport/remint.js
- npm run remint


### Remint_Batch Command
- node utils/nftport/remint_batch.js
- npm run remint_batch


### Reveal Command
- node utils/nftport/reveal.js
- npm run reveal


### UploadFiles Command
- node utils/nftport/uploadFiles.js
- npm run uploadFiles


### UploadMetas Command
- node utils/nftport/uploadMetas.js
- npm run uploadMetas


### UploadMetas_Directory Command
- node utils/nftport/uploadMetas_directory.js
- npm run uploadMetas_directory


## Opensea Commands
Use the following command from the code's root directory.

### Refresh_Metadata Command
- node utils/opensea/refresh_metadata.js
- npm run refresh_metadata


### Sell_Nfts Command
- node utils/opensea/sell_nfts.js
- npm run sell_nfts


## EXAMPLE - NO REVEAL (ERC721)

### Download Repo And Extract
<img width="1002" alt="Screenshot 2022-01-14 at 01 26 11" src="https://user-images.githubusercontent.com/52892685/149424701-b7db389e-2be7-4be5-a597-af1400cdaa1e.png">


### Install Packages
<img width="1188" alt="Screenshot 2022-01-14 at 01 31 50" src="https://user-images.githubusercontent.com/52892685/149425212-9bc5dc99-a0b8-4216-8481-d1d1fe533ee0.png">


### Update src/config.js
<img width="1257" alt="Screenshot 2022-01-14 at 01 33 20" src="https://user-images.githubusercontent.com/52892685/149425340-fcdec29c-7e11-44d8-8f84-49d2d8b64464.png">


### Update constants/account_details.js
<img width="1343" alt="Screenshot 2022-01-21 at 16 49 35" src="https://user-images.githubusercontent.com/52892685/150547469-0ad44be2-6dc5-489e-aee1-9ebda8c1a04f.png">


### Update constants/nft_details.js
<img width="1393" alt="Screenshot 2022-01-24 at 11 19 52" src="https://user-images.githubusercontent.com/52892685/150755331-a9dad47d-22bc-40b8-bcb6-d0e96f1a8b46.png">


### Art Engine - Build
<img width="1167" alt="Screenshot 2022-01-14 at 01 35 14" src="https://user-images.githubusercontent.com/52892685/149425539-a5208921-cc64-4594-b3c5-0fa981254abb.png">


### Upload Files
<img width="1311" alt="Screenshot 2022-01-14 at 01 37 22" src="https://user-images.githubusercontent.com/52892685/149425728-b15be911-e988-4b0b-993b-71dc98d258a8.png">

<img width="755" alt="Screenshot 2022-01-14 at 01 38 23" src="https://user-images.githubusercontent.com/52892685/149425829-0e99b018-0338-4d5c-912e-1b34864b811c.png">


### Upload Metas
<img width="1552" alt="Screenshot 2022-01-14 at 01 39 46" src="https://user-images.githubusercontent.com/52892685/149425953-716edba4-da7f-43f8-b901-5a67606dd50e.png">

<img width="520" alt="Screenshot 2022-01-14 at 01 40 49" src="https://user-images.githubusercontent.com/52892685/149426049-68feafe4-84d0-4838-911d-671ed3d4415f.png">


### Mint
<img width="526" alt="Screenshot 2022-01-14 at 01 41 35" src="https://user-images.githubusercontent.com/52892685/149426121-0cbe6184-5723-43a9-90d1-ad6aff9d9268.png">

<img width="225" alt="Screenshot 2022-01-14 at 11 56 04" src="https://user-images.githubusercontent.com/52892685/149496202-dadf2585-3bcd-4143-bcb2-a13b33c9dff5.png">

<img width="623" alt="Screenshot 2022-01-14 at 01 42 34" src="https://user-images.githubusercontent.com/52892685/149426210-8bbc03ae-d658-42c7-9a52-d275883ac738.png">


## EXAMPLE - REVEAL (ERC721)
### Download Repo And Extract
<img width="1002" alt="Screenshot 2022-01-14 at 01 26 11" src="https://user-images.githubusercontent.com/52892685/149424701-b7db389e-2be7-4be5-a597-af1400cdaa1e.png">


### Install Packages
<img width="1188" alt="Screenshot 2022-01-14 at 01 31 50" src="https://user-images.githubusercontent.com/52892685/149425212-9bc5dc99-a0b8-4216-8481-d1d1fe533ee0.png">


### Update src/config.js
<img width="1257" alt="Screenshot 2022-01-14 at 01 33 20" src="https://user-images.githubusercontent.com/52892685/149425340-fcdec29c-7e11-44d8-8f84-49d2d8b64464.png">


### Update constants/account_details.js
Make sure that your `uploadGenericMeta` key's value is set to `false` initially and that your contract's `metadata_updatable` value is set to `true`.
<img width="1343" alt="Screenshot 2022-01-21 at 16 49 35" src="https://user-images.githubusercontent.com/52892685/150547469-0ad44be2-6dc5-489e-aee1-9ebda8c1a04f.png">


### Update constants/nft_details.js
<img width="1393" alt="Screenshot 2022-01-24 at 11 19 52" src="https://user-images.githubusercontent.com/52892685/150755331-a9dad47d-22bc-40b8-bcb6-d0e96f1a8b46.png">


### Art Engine - Build
<img width="1167" alt="Screenshot 2022-01-14 at 01 35 14" src="https://user-images.githubusercontent.com/52892685/149425539-a5208921-cc64-4594-b3c5-0fa981254abb.png">


### Update JSON To Generic Meta
This script will utilize the generic field's values set in the `constants/nft_details.js` file and create a new `genericJSON` directory which will contain the metadata that you want to mint for the unrevealed NFTs. Ensure that you have updated the generic fields within the `constants/nft_details.js` file before running the script as it will use these fields to build the new generic json files.

<img width="569" alt="Screenshot 2022-01-14 at 11 34 41" src="https://user-images.githubusercontent.com/52892685/149493069-446f1000-d0a4-4dcc-a199-566e7ea1b8a0.png">

<img width="222" alt="Screenshot 2022-01-14 at 11 34 24" src="https://user-images.githubusercontent.com/52892685/149493036-6ef22890-73f0-45e9-84f3-63c8d6018481.png">

<img width="617" alt="Screenshot 2022-01-14 at 11 24 26" src="https://user-images.githubusercontent.com/52892685/149491586-621410d4-1620-4f85-aa73-272eceac77c0.png">


### Upload Files
<img width="1311" alt="Screenshot 2022-01-14 at 01 37 22" src="https://user-images.githubusercontent.com/52892685/149425728-b15be911-e988-4b0b-993b-71dc98d258a8.png">

<img width="755" alt="Screenshot 2022-01-14 at 01 38 23" src="https://user-images.githubusercontent.com/52892685/149425829-0e99b018-0338-4d5c-912e-1b34864b811c.png">


### Upload Metas - This will upload your `json` directory's files
<img width="1552" alt="Screenshot 2022-01-14 at 01 39 46" src="https://user-images.githubusercontent.com/52892685/149425953-716edba4-da7f-43f8-b901-5a67606dd50e.png">

<img width="227" alt="Screenshot 2022-01-14 at 11 36 52" src="https://user-images.githubusercontent.com/52892685/149493374-4cd82378-52c7-4244-b5d0-2786b28280f1.png">

<img width="520" alt="Screenshot 2022-01-14 at 01 40 49" src="https://user-images.githubusercontent.com/52892685/149426049-68feafe4-84d0-4838-911d-671ed3d4415f.png">


### Rename `ipfsMetas` directory 
Rename the `ipfsMetas` directory to `realIPFSMetas` or anything other than `ipfsMetas` as these are the files to be used for revealing your data after purchases.

<img width="224" alt="Screenshot 2022-01-14 at 11 19 53" src="https://user-images.githubusercontent.com/52892685/149490897-c7edcaca-d620-474d-9569-d0668f8cc57b.png">


### Update constants/account_details.js
Update your `uploadGenericMeta` key's value to `true`.
<img width="1339" alt="Screenshot 2022-01-21 at 17 15 10" src="https://user-images.githubusercontent.com/52892685/150551676-ec480599-a7ab-40f1-9744-c3da9d1b7929.png">


### Upload Metas - This will upload your `genericJSON` directory's files
<img width="1380" alt="Screenshot 2022-01-14 at 11 31 40" src="https://user-images.githubusercontent.com/52892685/149492663-2a278c8f-786a-4ffa-bc53-c2399fdf6a83.png">

<img width="228" alt="Screenshot 2022-01-14 at 11 37 54" src="https://user-images.githubusercontent.com/52892685/149493517-5a087df0-0a6f-4bf8-827b-13f921170502.png">

<img width="619" alt="Screenshot 2022-01-14 at 11 28 04" src="https://user-images.githubusercontent.com/52892685/149492147-cd7b71ad-e3b6-4d97-9ea7-f41309766157.png">


### Mint - This will mint your `unrevealed` NFTs' metadata
<img width="423" alt="Screenshot 2022-01-14 at 11 53 47" src="https://user-images.githubusercontent.com/52892685/149495913-28fd8389-497d-4fd0-b396-f2b16a119fc1.png">

<img width="225" alt="Screenshot 2022-01-14 at 11 56 04" src="https://user-images.githubusercontent.com/52892685/149496202-dadf2585-3bcd-4143-bcb2-a13b33c9dff5.png">

<img width="862" alt="Screenshot 2022-01-14 at 11 58 51" src="https://user-images.githubusercontent.com/52892685/149496615-308986e6-6398-430f-a9b4-a41a765bd7c9.png">


### Manually Update Metadata After Purchase
Once your NFT has sold, go to [NFTPort](https://www.nftport.xyz/) and go to the docs / API section. From there, go to the Minting section and choose the `Update a minted NFT` API. Take the packet on the API's right hand side and update it with the details from your unrevealed folder. (`realIPFSMetas or whatever you called your backup folder`)

Send the API request on the right hand side and if all goes well, then your NFT's metadata will now be updated and the revealed image will show.

**Please note that if you want to freeze the metadata so that no more updates can happen, then include the optional `freeze_metadata: true` field and key to the json packet that you will send in the API call**

<img width="569" alt="Screenshot 2022-01-14 at 11 48 39" src="https://user-images.githubusercontent.com/52892685/149495092-87ba2020-940b-47d5-b4ac-f83544db869f.png">


## EXAMPLE - NO REVEAL (ERC1155)

### Download Repo And Extract
<img width="1002" alt="Screenshot 2022-01-14 at 01 26 11" src="https://user-images.githubusercontent.com/52892685/149424701-b7db389e-2be7-4be5-a597-af1400cdaa1e.png">


### Install Packages
<img width="1188" alt="Screenshot 2022-01-14 at 01 31 50" src="https://user-images.githubusercontent.com/52892685/149425212-9bc5dc99-a0b8-4216-8481-d1d1fe533ee0.png">


### Update src/config.js
<img width="1257" alt="Screenshot 2022-01-14 at 01 33 20" src="https://user-images.githubusercontent.com/52892685/149425340-fcdec29c-7e11-44d8-8f84-49d2d8b64464.png">


### Update constants/account_details.js
<img width="1343" alt="Screenshot 2022-01-21 at 16 49 35" src="https://user-images.githubusercontent.com/52892685/150547469-0ad44be2-6dc5-489e-aee1-9ebda8c1a04f.png">


### Update constants/nft_details.js
<img width="1393" alt="Screenshot 2022-01-24 at 11 19 52" src="https://user-images.githubusercontent.com/52892685/150755331-a9dad47d-22bc-40b8-bcb6-d0e96f1a8b46.png">


### Art Engine - Build
<img width="1167" alt="Screenshot 2022-01-14 at 01 35 14" src="https://user-images.githubusercontent.com/52892685/149425539-a5208921-cc64-4594-b3c5-0fa981254abb.png">


### Upload Files
<img width="1311" alt="Screenshot 2022-01-14 at 01 37 22" src="https://user-images.githubusercontent.com/52892685/149425728-b15be911-e988-4b0b-993b-71dc98d258a8.png">

<img width="755" alt="Screenshot 2022-01-14 at 01 38 23" src="https://user-images.githubusercontent.com/52892685/149425829-0e99b018-0338-4d5c-912e-1b34864b811c.png">


### Upload Metas
<img width="1552" alt="Screenshot 2022-01-14 at 01 39 46" src="https://user-images.githubusercontent.com/52892685/149425953-716edba4-da7f-43f8-b901-5a67606dd50e.png">

<img width="520" alt="Screenshot 2022-01-14 at 01 40 49" src="https://user-images.githubusercontent.com/52892685/149426049-68feafe4-84d0-4838-911d-671ed3d4415f.png">


### Batch IPFS Metas Migration
<img width="659" alt="Screenshot 2022-01-21 at 17 19 10" src="https://user-images.githubusercontent.com/52892685/150552305-fd35b413-a6ab-4f39-9249-ff30d7b0ae5a.png">

<img width="254" alt="Screenshot 2022-01-21 at 17 21 59" src="https://user-images.githubusercontent.com/52892685/150552819-c7378d7b-5674-40da-92cf-40bfbe9aaf50.png">

<img width="762" alt="Screenshot 2022-01-21 at 17 22 07" src="https://user-images.githubusercontent.com/52892685/150552867-6ad3f673-4746-4d05-97a7-290c61455fa3.png">

<img width="720" alt="Screenshot 2022-01-21 at 17 22 13" src="https://user-images.githubusercontent.com/52892685/150552889-7f151a3a-a821-4a9b-9cb0-5b25dc038fcb.png">


### Mint Batch - This will mint your `unrevealed` NFTs' metadata
<img width="535" alt="Screenshot 2022-01-21 at 17 27 10" src="https://user-images.githubusercontent.com/52892685/150554008-8c3a57b2-2deb-436a-af57-18fe79f0bd52.png">

<img width="214" alt="Screenshot 2022-01-21 at 17 28 29" src="https://user-images.githubusercontent.com/52892685/150554028-d76389c7-bc73-4179-95ce-70f14f06016c.png">

<img width="859" alt="Screenshot 2022-01-21 at 17 31 46" src="https://user-images.githubusercontent.com/52892685/150554401-58ec00cc-6b27-4988-b596-0ded5663f2dc.png">


## EXAMPLE - REVEAL (ERC1155)
### Download Repo And Extract
<img width="1002" alt="Screenshot 2022-01-14 at 01 26 11" src="https://user-images.githubusercontent.com/52892685/149424701-b7db389e-2be7-4be5-a597-af1400cdaa1e.png">


### Install Packages
<img width="1188" alt="Screenshot 2022-01-14 at 01 31 50" src="https://user-images.githubusercontent.com/52892685/149425212-9bc5dc99-a0b8-4216-8481-d1d1fe533ee0.png">


### Update src/config.js
<img width="1257" alt="Screenshot 2022-01-14 at 01 33 20" src="https://user-images.githubusercontent.com/52892685/149425340-fcdec29c-7e11-44d8-8f84-49d2d8b64464.png">


### Update constants/account_details.js
Make sure that your `uploadGenericMeta` key's value is set to `false` initially and that your contract's `metadata_updatable` value is set to `true`.
<img width="1343" alt="Screenshot 2022-01-21 at 16 49 35" src="https://user-images.githubusercontent.com/52892685/150547469-0ad44be2-6dc5-489e-aee1-9ebda8c1a04f.png">


### Update constants/nft_details.js
<img width="1393" alt="Screenshot 2022-01-24 at 11 19 52" src="https://user-images.githubusercontent.com/52892685/150755331-a9dad47d-22bc-40b8-bcb6-d0e96f1a8b46.png">


### Art Engine - Build
<img width="1167" alt="Screenshot 2022-01-14 at 01 35 14" src="https://user-images.githubusercontent.com/52892685/149425539-a5208921-cc64-4594-b3c5-0fa981254abb.png">


### Update JSON To Generic Meta
This script will utilize the generic field's values set in the `constants/nft_details.js` file and create a new `genericJSON` directory which will contain the metadata that you want to mint for the unrevealed NFTs. Ensure that you have updated the generic fields within the `constants/nft_details.js` file before running the script as it will use these fields to build the new generic json files.

<img width="569" alt="Screenshot 2022-01-14 at 11 34 41" src="https://user-images.githubusercontent.com/52892685/149493069-446f1000-d0a4-4dcc-a199-566e7ea1b8a0.png">

<img width="222" alt="Screenshot 2022-01-14 at 11 34 24" src="https://user-images.githubusercontent.com/52892685/149493036-6ef22890-73f0-45e9-84f3-63c8d6018481.png">

<img width="617" alt="Screenshot 2022-01-14 at 11 24 26" src="https://user-images.githubusercontent.com/52892685/149491586-621410d4-1620-4f85-aa73-272eceac77c0.png">


### Upload Files
<img width="1311" alt="Screenshot 2022-01-14 at 01 37 22" src="https://user-images.githubusercontent.com/52892685/149425728-b15be911-e988-4b0b-993b-71dc98d258a8.png">

<img width="755" alt="Screenshot 2022-01-14 at 01 38 23" src="https://user-images.githubusercontent.com/52892685/149425829-0e99b018-0338-4d5c-912e-1b34864b811c.png">


### Upload Metas - This will upload your `json` directory's files
<img width="1552" alt="Screenshot 2022-01-14 at 01 39 46" src="https://user-images.githubusercontent.com/52892685/149425953-716edba4-da7f-43f8-b901-5a67606dd50e.png">

<img width="227" alt="Screenshot 2022-01-14 at 11 36 52" src="https://user-images.githubusercontent.com/52892685/149493374-4cd82378-52c7-4244-b5d0-2786b28280f1.png">

<img width="520" alt="Screenshot 2022-01-14 at 01 40 49" src="https://user-images.githubusercontent.com/52892685/149426049-68feafe4-84d0-4838-911d-671ed3d4415f.png">


### Rename `ipfsMetas` directory 
Rename the `ipfsMetas` directory to `realIPFSMetas` or anything other than `ipfsMetas` as these are the files to be used for revealing your data after purchases.

<img width="224" alt="Screenshot 2022-01-14 at 11 19 53" src="https://user-images.githubusercontent.com/52892685/149490897-c7edcaca-d620-474d-9569-d0668f8cc57b.png">


### Update constants/account_details.js
Update your `uploadGenericMeta` key's value to `true`.
<img width="1339" alt="Screenshot 2022-01-21 at 17 15 10" src="https://user-images.githubusercontent.com/52892685/150551676-ec480599-a7ab-40f1-9744-c3da9d1b7929.png">


### Upload Metas - This will upload your `genericJSON` directory's files
<img width="1380" alt="Screenshot 2022-01-14 at 11 31 40" src="https://user-images.githubusercontent.com/52892685/149492663-2a278c8f-786a-4ffa-bc53-c2399fdf6a83.png">

<img width="228" alt="Screenshot 2022-01-14 at 11 37 54" src="https://user-images.githubusercontent.com/52892685/149493517-5a087df0-0a6f-4bf8-827b-13f921170502.png">

<img width="619" alt="Screenshot 2022-01-14 at 11 28 04" src="https://user-images.githubusercontent.com/52892685/149492147-cd7b71ad-e3b6-4d97-9ea7-f41309766157.png">


### Batch IPFS Metas Migration
<img width="659" alt="Screenshot 2022-01-21 at 17 19 10" src="https://user-images.githubusercontent.com/52892685/150552305-fd35b413-a6ab-4f39-9249-ff30d7b0ae5a.png">

<img width="254" alt="Screenshot 2022-01-21 at 17 21 59" src="https://user-images.githubusercontent.com/52892685/150552819-c7378d7b-5674-40da-92cf-40bfbe9aaf50.png">

<img width="762" alt="Screenshot 2022-01-21 at 17 22 07" src="https://user-images.githubusercontent.com/52892685/150552867-6ad3f673-4746-4d05-97a7-290c61455fa3.png">

<img width="720" alt="Screenshot 2022-01-21 at 17 22 13" src="https://user-images.githubusercontent.com/52892685/150552889-7f151a3a-a821-4a9b-9cb0-5b25dc038fcb.png">


### Mint Batch - This will mint your `unrevealed` NFTs' metadata
<img width="535" alt="Screenshot 2022-01-21 at 17 27 10" src="https://user-images.githubusercontent.com/52892685/150554008-8c3a57b2-2deb-436a-af57-18fe79f0bd52.png">

<img width="214" alt="Screenshot 2022-01-21 at 17 28 29" src="https://user-images.githubusercontent.com/52892685/150554028-d76389c7-bc73-4179-95ce-70f14f06016c.png">

<img width="859" alt="Screenshot 2022-01-21 at 17 31 46" src="https://user-images.githubusercontent.com/52892685/150554401-58ec00cc-6b27-4988-b596-0ded5663f2dc.png">


### Manually Update Metadata After Purchase
Once your NFT has sold, go to [NFTPort](https://www.nftport.xyz/) and go to the docs / API section. From there, go to the Minting section and choose the `Update a minted NFT` API. Take the packet on the API's right hand side and update it with the details from your unrevealed folder. (`realIPFSMetas or whatever you called your backup folder`)

Send the API request on the right hand side and if all goes well, then your NFT's metadata will now be updated and the revealed image will show.

**Please note that if you want to freeze the metadata so that no more updates can happen, then include the optional `freeze_metadata: true` field and key to the json packet that you will send in the API call**

<img width="569" alt="Screenshot 2022-01-14 at 11 48 39" src="https://user-images.githubusercontent.com/52892685/149495092-87ba2020-940b-47d5-b4ac-f83544db869f.png">


## EXAMPLE - DNA EXISTS AND NEED MORE LAYERS TO GROW EDITION
When you encounter `DNA exists!`, do not panic as this simply means the combination of elements have already created an image and it will try a different combination. If you encounter `You need more layers or elements to grow your edition to 20 artworks!`, with `20` being the number of NFTs you are trying to generate, then it simply means you do not have enough unique items within your layers to create the total number of NFTs that you are trying to create. You need to add more items to your layers, so maybe add a `blank` image so that your layers only sometimes populate. Another item that you can look to modify when you are working with **big** collections is the `uniqueDnaTorrance` setting in the `src/config.js` file. This is set to `10000` by default, but if you might need to make that a higher number and try to generate your collection again. For demo purposes, I set my `uniqueDnaTorrance` to `2` to for demo purposes to trigger the error.

<img width="478" alt="Screenshot 2022-01-14 at 09 33 11" src="https://user-images.githubusercontent.com/52892685/149468855-8e1406d1-9403-4e7a-8406-b47b574c7d11.png">

<img width="191" alt="Screenshot 2022-01-14 at 09 38 09" src="https://user-images.githubusercontent.com/52892685/149469412-49b5fbed-790f-4bf1-a61a-bbb24521c982.png">


## EXAMPLE - FILE ALREADY UPLOADED
When you encounter `5 already uploaded.` error in the uploadFiles script, it means that your json file already contains a `https://xxxx` URL for the `file_url` key. If you would really like to re-upload the image, simply remove the URL value (not the whole line, just the value, otherwise you will see an error if the field key is not there) or change it to `IPFS`, then run the uploadFiles script again and the files will be re-uploaded.

<img width="1137" alt="Screenshot 2022-01-14 at 09 56 57" src="https://user-images.githubusercontent.com/52892685/149471713-41fe163b-de25-4a48-ad24-f7e2c474b3a4.png">

<img width="631" alt="Screenshot 2022-01-14 at 09 56 03" src="https://user-images.githubusercontent.com/52892685/149471584-a8548b72-aa90-4d4c-a4e6-604a85ace6a1.png">

<img width="624" alt="Screenshot 2022-01-14 at 09 58 40" src="https://user-images.githubusercontent.com/52892685/149471944-b46f4316-ee3d-45a7-88b0-50b8e2d3a2c8.png">

<img width="608" alt="Screenshot 2022-01-14 at 09 59 21" src="https://user-images.githubusercontent.com/52892685/149472026-2bd2cb0c-5869-448a-bb7d-baebe056c6a2.png">

<img width="1148" alt="Screenshot 2022-01-14 at 10 03 21" src="https://user-images.githubusercontent.com/52892685/149472534-109be0d2-e61c-448c-8376-6086b3bc5dff.png">


## EXAMPLE - UPLOAD GENERIC METAS WITHOUT CREATING GENERIC METAS FILES
When you are trying to upload your metadata files via the uploadMetas script, but you haven't run the `update_json_to_generic_meta` script before attempting the upload, then the below error will be seen as no `genericJSON` directory can be found.

<img width="1388" alt="Screenshot 2022-01-14 at 10 46 13" src="https://user-images.githubusercontent.com/52892685/149484977-d4ebf628-5c10-44f3-9267-3fe65fe57653.png">

<img width="1388" alt="Screenshot 2022-01-14 at 10 44 21" src="https://user-images.githubusercontent.com/52892685/149483988-6cf54750-90d5-4ad3-84b5-e91846f26917.png">


## EXAMPLE - METADATA ALREADY UPLOADED OUTPUT
<img width="1594" alt="Screenshot 2022-01-14 at 01 46 44" src="https://user-images.githubusercontent.com/52892685/149426543-1226ae6c-63b6-4ab7-9ee6-8cc8ece04acb.png">


## EXAMPLE - MINT FAILED, USING CHECK_MINTS AND REMINT
<img width="884" alt="Screenshot 2022-01-21 at 17 48 58" src="https://user-images.githubusercontent.com/52892685/150557178-09646270-945c-42b7-b2a9-b147574ded2e.png">

<img width="215" alt="Screenshot 2022-01-21 at 17 44 30" src="https://user-images.githubusercontent.com/52892685/150556493-5ba8c92a-0d21-4856-9736-3119617c9e9c.png">


## EXAMPLE - MINT BATCH FAILED, USING CHECK_MINTS_BATCH AND REMINT_BATCH
<img width="877" alt="Screenshot 2022-01-21 at 17 44 02" src="https://user-images.githubusercontent.com/52892685/150556470-ce40a4aa-9b79-4b4d-8b09-7cf52a37c47c.png">

<img width="215" alt="Screenshot 2022-01-21 at 17 44 30" src="https://user-images.githubusercontent.com/52892685/150556493-5ba8c92a-0d21-4856-9736-3119617c9e9c.png">


## EXAMPLE - EDITION ALREADY MINTED
<img width="545" alt="Screenshot 2022-01-14 at 01 47 30" src="https://user-images.githubusercontent.com/52892685/149426612-5036e729-9e1e-4492-8652-88037d4f054e.png">


## EXAMPLE - CONTRACT ALREADY HAS THE GIVEN TOKEN ID
This means the edition number of the token that you are trying to mint already exists against your contract. Go to your contract address on your chain's explorer and you should see that the tokenid is already there. 

**Please note that there is no need to panic as you can't upload the same tokenid against a given contract, so you won't have any duplicates.**

<img width="1019" alt="Screenshot 2022-01-14 at 10 59 49" src="https://user-images.githubusercontent.com/52892685/149487898-4500a598-2129-4e2c-9a91-f356829e02d9.png">

<img width="1403" alt="Screenshot 2022-01-14 at 11 02 40" src="https://user-images.githubusercontent.com/52892685/149488352-f14a8236-5bea-44d2-8b55-6870884c6364.png">

<img width="1442" alt="Screenshot 2022-01-14 at 11 02 59" src="https://user-images.githubusercontent.com/52892685/149488412-300f54bb-f24a-4b67-8649-c3f13abaf562.png">

