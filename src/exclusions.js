// Load modules and constants
const { combinationOfTraitsAlreadyExists } = require('./exclusions/combination_traits');
const { incompatibleTraitsUsed } = require('./exclusions/incompatible_traits');
const { traitDependenciesInvalid } = require('./exclusions/dependency_traits');

// Checks the different exclusions and return true if any of them are true
const needsExclusion = (selectedTraitsList, newTraits, maxRepeatedTraits, incompatibleTraits, layerItemsMaxRepeatedTraits, dependendTraits) => {

  return combinationOfTraitsAlreadyExists(selectedTraitsList, newTraits, maxRepeatedTraits, layerItemsMaxRepeatedTraits) ||
    incompatibleTraitsUsed(newTraits, incompatibleTraits) ||
    traitDependenciesInvalid(newTraits, dependendTraits)
};

module.exports = {
  needsExclusion,
};