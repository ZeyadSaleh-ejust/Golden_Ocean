// ==========================================
// FORM CONSTANTS
// ==========================================

/**
 * Initial state for navigation officer report form
 * Based on Pnav_03.html design
 */
export const INITIAL_FORM_STATE = {
    durationOnShip: '',          // Duration on ship in minutes
    subjectToCheck: 'no',         // Radio: yes/no - Subject to check?
    shipParticular: 'no',         // Radio: yes/no - Ship particular?
    photographyPercentage: '',    // Photography percentage (0-100)
    photos: [],                   // Photo files array
    numberOfItems: '',            // Number of items in inventory
    returns: '',                  // Returns description (text)
    returnsCount: '',             // Returns count (conditional field)
    competitors: '',              // Competitors names
    numberOfJumboJets: '',        // Number of jumbo jets
    notes: ''                     // Additional notes
}
