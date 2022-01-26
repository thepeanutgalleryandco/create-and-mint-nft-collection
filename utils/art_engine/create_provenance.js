const crypto = require('crypto');
const fs = require('fs');
const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);

const re = new RegExp("^([0-9]+).png"); // Will be used to ensure only JSON files from the JSONDIR is used in the meta's updated.

/*
	Here we loop through all generated images, retrieve their filename, hash each image and concat it
	to concatedHashString.concatedHash, and finally create a an object which to append to finalProof.collection
*/
const hashImages = (finalProof, concatedHashString) => {
	const files = fs.readdirSync(`${FOLDERS.imagesDir}`);
	if (!files.length) {
		return null;
	}
	files.sort(function(a, b){
		return a.split(".")[0] - b.split(".")[0];
	});

	for (const file of files) {
        if (re.test(file)) { 
            const imageHash = crypto.createHash('sha256').update(file).digest('hex');
            concatedHashString.concatedHash += imageHash;
            let metaData = JSON.parse(fs.readFileSync(`${FOLDERS.jsonDir}/${file.substring(0, file.length - 4)}.json`));
            metaData.imageHash = imageHash;
            finalProof.collection.push(metaData);
        }
	}
	finalProof.provenance = crypto.createHash('sha256').update(concatedHashString.concatedHash).digest('hex');;
}

/*
	Here we create the concatedHash.json and provenanceHash.json files in the jsonDir directory
*/
const createProvenanceAndConcatedHashJSON = (finalProof, concatedHashString) => {
	fs.writeFileSync(`${FOLDERS.jsonDir}/concatedHash.json`, JSON.stringify(concatedHashString, null, 2));
	fs.writeFileSync(`${FOLDERS.jsonDir}/provenanceHash.json`, JSON.stringify(finalProof, null, 2));
    console.log(`Created ${FOLDERS.jsonDir}/concatedHash.json file`);
    console.log(`Created ${FOLDERS.jsonDir}/provenanceHash.json file`);
}

const runMain = () => {
	const finalProof = {
		provenance: '',
		collection: [],
	}
	const concatedHashString = {
		concatedHash: '',
	};

	if (hashImages(finalProof, concatedHashString) === null) {
		console.log('No images exist. Please first create your images and json files by running node index.js');
		process.exit(0);	
	}
    
    console.log("Staring with provenance hash creation.");
	createProvenanceAndConcatedHashJSON(finalProof, concatedHashString);
    console.log("Done with provenance hash creation.");
}

runMain();