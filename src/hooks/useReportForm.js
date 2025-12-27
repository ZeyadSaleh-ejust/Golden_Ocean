import { useState } from 'react'
import { validateField, validateDateRange } from '../utils/validators'
import { INITIAL_FORM_STATE } from '../utils/formConstants'

/**
 * Custom hook for managing report form state and validation
 */
export function useReportForm() {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE)
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target

        // Handle different input types
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else if (type === 'file') {
            // Store file objects
            setFormData(prev => ({ ...prev, [name]: Array.from(files) }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        let isValid = true

        // Validate all fields
        Object.keys(formData).forEach(fieldName => {
            const validation = validateField(fieldName, formData[fieldName])
            if (!validation.valid) {
                newErrors[fieldName] = validation.message
                isValid = false
            }
        })

        // Validate date range
        const dateRangeValidation = validateDateRange(formData.deliveryDate, formData.expiryDate)
        if (!dateRangeValidation.valid) {
            newErrors.expiryDate = dateRangeValidation.message
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE)
        setErrors({})
    }

    return {
        formData,
        errors,
        handleInputChange,
        validateForm,
        resetForm
    }
}
