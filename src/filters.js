// Load modules and constants
const { combinationOfTraitsAlreadyExists } = require('./filters/combination_traits');
const { incompatibleTraitsUsed } = require('./filters/incompatible_traits');
const { dependentTraitsUsed } = require('./filters/dependent_traits');

// Checks the different filtrations and return true if any of them are true
const needsFiltration = (selectedTraitsList, newTraits, maxRepeatedTraits, incompatibleTraits, layerItemsMaxRepeatedTraits, dependentTraits) => {

  return (
    combinationOfTraitsAlreadyExists(selectedTraitsList, newTraits, maxRepeatedTraits, layerItemsMaxRepeatedTraits) 
    || incompatibleTraitsUsed(newTraits, incompatibleTraits)
    || dependentTraitsUsed(newTraits, dependentTraits)
  );
};

module.exports = {
  needsFiltration,
};