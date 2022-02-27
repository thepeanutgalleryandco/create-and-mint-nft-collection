// Load modules and constants
const { combinationOfTraitsAlreadyExists } = require('./exclusions/combination_traits');
const { incompatibleTraitsUsed } = require('./exclusions/incompatible_traits');

// Checks the different exclusions and return true if any of them are true
const needsExclusion = (selectedTraitsList, newTraits, maxRepeatedTraits, incompatibleTraits, layerItemsMaxRepeatedTraits) => {

  return combinationOfTraitsAlreadyExists(selectedTraitsList, newTraits, maxRepeatedTraits, layerItemsMaxRepeatedTraits) || incompatibleTraitsUsed(newTraits, incompatibleTraits);
};

module.exports = {
  needsExclusion,
};