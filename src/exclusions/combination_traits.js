// Check if the maximum repeatability have been reached
const combinationOfTraitsAlreadyExists  = (selectedTraitsList, newTraits, maxRepeatedTraits) => {

    // Check if maximum repeatability check needs to be done and if not, return false and exit this check
    if (!maxRepeatedTraits) {
      return false;
    }
    
    // Loops through each trait within the selected traits list
    for (let existingTraits of selectedTraitsList) {
      
      // Set a starting value of 0 for the selected traits
      let commonTraits = 0;

      // Loops through each new trait and only keep on looping if maximum repeatability have not been reached
      for (let i = 0; (i < newTraits.length) && (commonTraits <= maxRepeatedTraits); i++) {

        // Checks if the new trait is already in the selected traits list
        if (newTraits[i].id === existingTraits[i].id) {

          // Increment the selected traits value as it has been found before
          commonTraits++;
        }
      }

      // Check if the selected trait has breached the maximum repeatability limit and return true if that is the case
      if (commonTraits > maxRepeatedTraits) {
        console.log("Combination of traits excluded because of maximum repeatability exclusion rule!");
        return true;
      }
  
    }

    // Return false if the traits have been looped through and the maximum repeatability have not been breached
    return false;
  };
  
  module.exports = {
    combinationOfTraitsAlreadyExists,
  };