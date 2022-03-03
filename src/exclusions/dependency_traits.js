// Take in a list of layers and then build a simple json object that contains the layer name with the layer item next to it.
const simplifyTraits = (traits) => {
  const simpleTraits = {};
  traits.forEach((trait) => {
    simpleTraits[trait.layer] = trait.name;
  });
  return simpleTraits;
};

// Set true / false if the layer has defined dependencies
const traitHasDefinedDependency = (newTrait, dependendTraits) => {
  const traitKey = `${newTrait.layer}/${newTrait.name}`;
  return dependendTraits[traitKey];
};

// Set true / false if incompatabale layers are used and return true if it is the case
const traitDependenciesInvalid = (newTraits, dependendTraits) => {

  // Check if traits check needs to be done and if not, return false and exit this check
  if (!dependendTraits) {
    return false;
  }

  // Generate a layer_name: layer_item json object from the traits list
  const simpleNewTraits = simplifyTraits(newTraits);

  // Loop through each layer in the list
  for (let i = 0; i < newTraits.length; i++) {

    // Set true / false if the layer has a defined incompatibility
    const definedDependency = traitHasDefinedDependency(newTraits[i], dependendTraits);

    // Check if incompatibilities were found for the layer
    if (definedDependency !== undefined) {

      // Loop through each of the dependent layer items
      for (let n = 0;
        (n < definedDependency.length); n++) {

        // Split each of the incompatibility layers into a layer name and a layer item
        const [layer, trait] = definedDependency[n].split('/');

        // Check if the layer name and layer item combination can be found in the layer_name and layer_item json object and if it can be found, return true and stop processing further
        if (simpleNewTraits[layer] != trait) {
          console.log("Combination of traits excluded because of dependency layers exclusion rule! ("
            + newTraits[i].layer + "/" + newTraits[i].name + " requires "
            + layer + "/" + trait + ")");
          return true;
        }
      }
    }
  }

  // If all layers and layer items were checked and no incompatibilities found, then return false
  return false;
};

// will also check for dependencies, but instead of just checking it, it will also fix it an generate a new DNA.
const fixDNAWithTraitDependencies = (newTraits, dependendTraits) => {

  // Check if traits check needs to be done and if not, return false and exit this check
  if (!dependendTraits) {
    return false;
  }

  // Generate a layer_name: layer_item json object from the traits list
  const simpleNewTraits = simplifyTraits(newTraits);

  // Loop through each layer in the list
  for (let i = 0; i < newTraits.length; i++) {

    // Set true / false if the layer has a defined incompatibility
    const definedDependency = traitHasDefinedDependency(newTraits[i], dependendTraits);

    // Check if incompatibilities were found for the layer
    if (definedDependency !== undefined) {

      // Loop through each of the dependent layer items
      for (let n = 0; n < definedDependency.length; n++) {

        // Split each of the incompatibility layers into a layer name and a layer item
        const [layer, trait] = definedDependency[n].split('/');

        // // Check if the layer name and layer item combination can be found in the layer_name and layer_item json object and if it can be found, return true and stop processing further
        if (simpleNewTraits[layer] != trait) {
          console.log("DNA fixed because of dependency layers exclusion rule! ("
            + newTraits[i].layer + "/" + newTraits[i].name + " requires "
            + layer + "/" + trait + ")");
          const index = newTraits.findIndex(x => x.layer === layer);
          newTraits[index].name = trait;
        }
      }
    }
  }

  // If all layers and layer items were checked and no incompatibilities found, then return false
  return newTraits;
}

module.exports = {
  traitDependenciesInvalid,
  fixDNAWithTraitDependencies
};