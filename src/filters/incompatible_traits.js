// Take in a list of layers and then build a simple json object that contains the layer name with the layer item next to it.
const simplifyTraits = (traits) => {
    const simpleTraits = {};
    traits.forEach((trait) => {
      simpleTraits[trait.layer] = trait.name;
    });
    return simpleTraits;
};

// Set true / false if the layer has defined incompatibilities
const traitHasDefinedIncompatibilities = (newTrait, incompatibleTraits) => {
    const traitKey = `${newTrait.layer}/${newTrait.name}`;
    return incompatibleTraits[traitKey];
};

// Set true / false if incompatabale layers are used and return true if it is the case
const incompatibleTraitsUsed = (newTraits, incompatibleTraits) => {

    // Check if incompatible traits check needs to be done and if not, return false and exit this check
    if (!incompatibleTraits) {
        return false;
    }

    // Generate a layer_name: layer_item json object from the traits list
    const simpleNewTraits = simplifyTraits(newTraits);

    // Loop through each layer in the list
    for (let i = 0; (i < newTraits.length); i++) {
        
        // Set true / false if the layer has a defined incompatibility
        const definedIncompatibilities = traitHasDefinedIncompatibilities(newTraits[i], incompatibleTraits);

        // Check if incompatibilities were found for the layer
        if (definedIncompatibilities !== undefined) {
            
            // Loop through each of the incompatibility layer items
            for (let n = 0; (n < definedIncompatibilities.length); n++) {
                
                // Split each of the incompatibility layers into a layer name and a layer item
                const [layer, trait] = definedIncompatibilities[n].split('/');
                
                // Check if the layer name and layer item combination can be found in the layer_name and layer_item json object and if it can be found, return true and stop processing further
                if (simpleNewTraits[layer] === trait) {
                    console.log("Combination of traits filtered because of incompatible layers filtration rule!");
                    return true;
                }
            }
        }
    }
    
    // If all layers and layer items were checked and no incompatibilities found, then return false
    return false;
};
  
module.exports = {
  incompatibleTraitsUsed,
};