// Take in a list of layers and then build a simple json object that contains the layer name with the layer item next to it.
const simplifyTraits = (traits) => {
    const simpleTraits = {};
    traits.forEach((trait) => {
      simpleTraits[trait.layer] = trait.name;
    });
    return simpleTraits;
};

// Set true / false if the layer has defined dependencies
const traitHasDefinedDependencies = (newTrait, dependentTraits) => {
    const traitKey = `${newTrait.layer}/${newTrait.name}`;
    return dependentTraits[traitKey];
};

// Set true / false if dependent layers are used and return true if it is not the case
const dependentTraitsUsed = (newTraits, dependentTraits) => {

    let totalDependencyLayerItemScore = 0 ;
    let actualDependencyLayerItemScore = 0 ;

    // Check if incompatible traits check needs to be done and if not, return false and exit this check
    if (!dependentTraits) {
        return false;
    }

    // Generate a layer_name: layer_item json object from the traits list
    const simpleNewTraits = simplifyTraits(newTraits);

    // Loop through each layer in the list
    for (let i = 0; (i < newTraits.length); i++) {
        
        // Set true / false if the layer has a defined dependencies
        const definedDependencies = traitHasDefinedDependencies(newTraits[i], dependentTraits);

        // Check if dependencies were found for the layer
        if (definedDependencies !== undefined) {
            
            // Create a new set to get the unique layer dependency counts
            const dependencyLayerItems = new Set();
            
            // Loop through each of the dependent layer items
            for (let n = 0; (n < definedDependencies.length); n++) {
                
                // Split each of the dependent layers into a layer name and a layer item
                const [layer, trait] = definedDependencies[n].split('/');
                
                // Adding layer to dependencyLayerItems set to ensure we only count the layer once if multiple layer items were specified for a single dependency layer item
                dependencyLayerItems.add(layer);
                
                // Check if the layer name and layer item combination can be found in the layer_name and layer_item json object and add to the actual count. 
                if (simpleNewTraits[layer] === trait) {
                    
                    // Increment the actual dependency layer item score
                    actualDependencyLayerItemScore += 1;
                }
            }

            // Increment total dependency layer item score as the layer can have multiple dependency items
            totalDependencyLayerItemScore += dependencyLayerItems.size ;
        }
    }
    
    // If the actual found count is equal to the total count, then return false, else true.
    if (totalDependencyLayerItemScore === actualDependencyLayerItemScore) {
        return false
    } else {
        console.log(`Combination of traits filtered because of dependent traits filtration rule! Only ${actualDependencyLayerItemScore}/${totalDependencyLayerItemScore} dependent layers were found.`);
        return true
    }
};
  
module.exports = {
    dependentTraitsUsed,
};