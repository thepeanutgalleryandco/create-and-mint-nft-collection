// Check if the maximum repeatability have been reached
const combinationOfTraitsAlreadyExists  = (selectedTraitsList, newTraits, maxRepeatedTraits, layerItemsMaxRepeatedTraits) => {
  
  let traitLayerCounts = {};
  let traitLayerItemCounts = {};

  // Loops through each trait list of previous selected traits list
  for (let existingTraits of selectedTraitsList) {

    // Loops through each trait and add to count
    for (let i = 0; i < existingTraits.length; i++) {
      
      // Check if trait exists in traitLayerCounts and traitLayerItemCounts objects and if it does, then add to the count, otherwise initialize with a count of 1.
      traitLayerCounts[`${existingTraits[i].layer}`] = traitLayerCounts[`${existingTraits[i].layer}`] ? traitLayerCounts[`${existingTraits[i].layer}`] + 1 : 1 ;
      traitLayerItemCounts[`${existingTraits[i].layer}/${existingTraits[i].name}`] = traitLayerItemCounts[`${existingTraits[i].layer}/${existingTraits[i].name}`] ? traitLayerItemCounts[`${existingTraits[i].layer}/${existingTraits[i].name}`] + 1 : 1 ; 
    }
  }

  // Loops through each new trait and add to count
  for (let i = 0; i < newTraits.length; i++) {
        
    // Check if trait exists in traitLayerCounts and traitLayerItemCounts objects and if it does, then add to the count, otherwise initialize with a count of 1.
    traitLayerCounts[`${newTraits[i].layer}`] = traitLayerCounts[`${newTraits[i].layer}`] ? traitLayerCounts[`${newTraits[i].layer}`] + 1 : 1 ;
    traitLayerItemCounts[`${newTraits[i].layer}/${newTraits[i].name}`] = traitLayerItemCounts[`${newTraits[i].layer}/${newTraits[i].name}`] ? traitLayerItemCounts[`${newTraits[i].layer}/${newTraits[i].name}`] + 1 : 1 ;

    // Check if the selected trait has breached the global layer item maximum repeatability limit and return true if that is the case
    if (traitLayerItemCounts[`${newTraits[i].layer}/${newTraits[i].name}`] > newTraits[i].layerItemsMaxRepeatedTrait) {
      console.log(`Combination of traits filtered because of global layer item (${newTraits[i].layer}) maximum repeatability filtration rule!`);
      return true;
    }   
        
    // Check if the selected trait has breached the layer maximum repeatability limit and return true if that is the case
    if (traitLayerCounts[`${newTraits[i].layer}`] > newTraits[i].maxRepeatedTrait) {
      console.log(`Combination of traits filtered because of layer (${newTraits[i].layer}) maximum repeatability filtration rule!`);
      return true;
    }

    // Check if the selected trait has breached the global maximum repeatability limit and return true if that is the case
    if (traitLayerItemCounts[`${newTraits[i].layer}/${newTraits[i].name}`] > maxRepeatedTraits) {
      console.log(`Combination of traits filtered because of global (${maxRepeatedTraits}) maximum repeatability filtration rule!`);
      return true;
    }
  }

  // Loops through layerItemsMaxRepeatedTraits list
  for (layerItem in layerItemsMaxRepeatedTraits) {

    // Check if the selected trait has breached the layer item maximum repeatability limit and return true if that is the case
    if (traitLayerItemCounts[`${layerItemsMaxRepeatedTraits[layerItem].name}`] > layerItemsMaxRepeatedTraits[layerItem].layerItemMaxRepeatedTrait) {
      console.log(`Combination of traits filtered because of layer item (${layerItemsMaxRepeatedTraits[layerItem].name}) maximum repeatability filtration rule!`);
      return true;
    } 
  }

  // Return false if the traits have been looped through and the maximum repeatability have not been breached
  return false;
};

module.exports = {
  combinationOfTraitsAlreadyExists,
};