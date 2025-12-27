// ==========================================
// FORM VALIDATION UTILITIES
// ==========================================

/**
 * Validate a single form field
 */
export function validateField(fieldName, value, allFormData = {}) {
    switch (fieldName) {
        case 'durationOnShip':
            if (!value || value === '' || value === null || value === undefined) {
                return { valid: false, message: 'Duration on ship is required' }
            }
            if (value < 0) {
                return { valid: false, message: 'Duration cannot be negative' }
            }
            return { valid: true }

        case 'photographyPercentage':
            if (value === '' || value === null || value === undefined) {
                return { valid: true } // Optional field
            }
            const percentage = parseFloat(value)
            if (percentage < 0 || percentage > 100) {
                return { valid: false, message: 'Percentage must be between 0 and 100' }
            }
            return { valid: true }

        case 'numberOfItems':
        case 'returnsCount':
            if (value === '' || value === null || value === undefined) {
                return { valid: true } // Optional fields
            }
            if (value < 0) {
                return { valid: false, message: 'Value cannot be negative' }
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

        case 'returns':
        case 'competitors':
        case 'notes':
            // Optional text fields
            return { valid: true }

        case 'subjectToCheck':
        case 'shipParticular':
            // Radio buttons always have a value
            return { valid: true }

        case 'photos':
            // Photos are optional
            return { valid: true }

        default:
            return { valid: true }
    }
}

/**
 * Validate date range (expiry must be after delivery)
 * NOTE: This is kept for backwards compatibility but not used in new form
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
