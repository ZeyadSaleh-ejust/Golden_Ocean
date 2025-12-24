// ==========================================
// FORM VALIDATION UTILITIES
// ==========================================

/**
 * Validate a single form field
 */
export function validateField(fieldName, value) {
    switch (fieldName) {
        case 'deliveryDate':
        case 'expiryDate':
        case 'dateOfDelivery':
        case 'longevity':
            if (!value) {
                return { valid: false, message: 'Date is required' }
            }
            return { valid: true }

        case 'numberOfJumboJets':
            if (value === '' || value === null || value === undefined) {
                return { valid: false, message: 'This field is required' }
            }
            if (value < 0) {
                return { valid: false, message: 'Value cannot be negative' }
            }
            return { valid: true }

        case 'vesselName':
        case 'returns':
        case 'competitors':
        case 'notes':
            if (!value || value.trim() === '') {
                return { valid: false, message: 'This field is required' }
            }
            return { valid: true }

        case 'photos':
            // Photos are optional, so always valid
            return { valid: true }

        case 'vesselSubjectToInspection':
            // Boolean checkbox, always valid
            return { valid: true }

        default:
            return { valid: true }
    }
}

/**
 * Validate date range (expiry must be after delivery)
 */
export function validateDateRange(deliveryDate, expiryDate) {
    if (!deliveryDate || !expiryDate) {
        return { valid: true } // Other validators handle required checks
    }

    if (new Date(expiryDate) <= new Date(deliveryDate)) {
        return {
            valid: false,
            message: 'Expiry date must be after delivery date'
        }
    }

    return { valid: true }
}
