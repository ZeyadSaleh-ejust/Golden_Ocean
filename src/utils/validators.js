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
            if (!value) {
                return { valid: false, message: 'Date is required' }
            }
            return { valid: true }

        case 'returns':
        case 'numberOfGames':
            if (value === '' || value === null || value === undefined) {
                return { valid: false, message: 'This field is required' }
            }
            if (value < 0) {
                return { valid: false, message: 'Value cannot be negative' }
            }
            return { valid: true }

        case 'downloadRate':
        case 'screenshotRate':
            if (value === '' || value === null || value === undefined) {
                return { valid: false, message: 'This field is required' }
            }
            if (value < 0 || value > 100) {
                return { valid: false, message: 'Rate must be between 0 and 100' }
            }
            return { valid: true }

        case 'competitors':
        case 'durationOfStay':
            if (!value || value.trim() === '') {
                return { valid: false, message: 'This field is required' }
            }
            return { valid: true }

        case 'review':
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Review is required' }
            }
            if (value.length < 10) {
                return { valid: false, message: 'Review must be at least 10 characters' }
            }
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
