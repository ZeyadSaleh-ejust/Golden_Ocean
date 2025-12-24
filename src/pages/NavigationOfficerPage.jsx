import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { useGPSContext } from '../contexts/GPSTrackingContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { validateField, validateDateRange } from '../utils/validators'
import { formatDate, formatDateTime } from '../utils/authUtils'
import '../styles/navigation.css'

export default function NavigationOfficerPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { selectedOrderId, assignedOrders, clearSelectedOrder } = useOrder()
    const { stopTracking } = useGPSContext()
    const [reports, setReports] = useLocalStorage('golden_ocean_reports', [])

    // Redirect if no order selected
    useEffect(() => {
        if (!selectedOrderId) {
            navigate('/navigation-officer/select-order')
        }
    }, [selectedOrderId, navigate])

    const selectedOrder = assignedOrders.find(o => o.id === selectedOrderId)

    const [formData, setFormData] = useState({
        vesselName: '',
        dateOfDelivery: '',
        returns: '',
        competitors: '',
        longevity: '',
        photos: [],
        vesselSubjectToInspection: false,
        numberOfJumboJets: '',
        notes: '',
        deliveryDate: '',
        expiryDate: ''
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [submittedReport, setSubmittedReport] = useState(null)

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

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            // Scroll to first error
            const firstErrorField = Object.keys(errors)[0]
            if (firstErrorField) {
                document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            return
        }

        setIsLoading(true)

        // Simulate network delay
        setTimeout(() => {
            const report = {
                id: 'RPT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
                orderId: selectedOrderId,
                officerId: currentUser.id,
                officerName: currentUser.username,
                submittedAt: new Date().toISOString(),
                ...formData,
                numberOfJumboJets: parseInt(formData.numberOfJumboJets) || 0,
                // Convert photos to base64 or file names for storage
                photoFileNames: formData.photos.map(f => f.name)
            }

            setReports([...reports, report])
            setSubmittedReport(report)
            setIsLoading(false)
            setShowModal(true)

            // Stop GPS tracking
            stopTracking()

            // Clear selected order after submission
            clearSelectedOrder()
        }, 800)
    }

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            setFormData({
                vesselName: '',
                dateOfDelivery: '',
                returns: '',
                competitors: '',
                longevity: '',
                photos: [],
                vesselSubjectToInspection: false,
                numberOfJumboJets: '',
                notes: '',
                deliveryDate: '',
                expiryDate: ''
            })
            setErrors({})
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setFormData({
            vesselName: '',
            dateOfDelivery: '',
            returns: '',
            competitors: '',
            longevity: '',
            photos: [],
            vesselSubjectToInspection: false,
            numberOfJumboJets: '',
            notes: '',
            deliveryDate: '',
            expiryDate: ''
        })
        setErrors({})
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            clearSelectedOrder()
            logout()
            navigate('/', { replace: true })
        }
    }

    if (!selectedOrder) {
        return null
    }

    return (
        <div className="navigation-page">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="header-icon">⚓</div>
                        <div className="header-text">
                            <h1>Navigation Officer</h1>
                            <p>Delivery Report - {selectedOrder.id}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <div className="user-info">
                            <div className="user-avatar">{currentUser.username.charAt(0).toUpperCase()}</div>
                            <span className="user-name">{currentUser.username}</span>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="page-intro">
                    <h2>Submit Delivery Report</h2>
                    <p>Complete all required fields for Order: <strong>{selectedOrder.id}</strong></p>
                    <div className="order-info-banner">
                        <span>📍 Destination: {selectedOrder.destination.name}</span>
                        <span>👤 Customer: {selectedOrder.customerName}</span>
                    </div>
                </div>

                <div className="report-form-container">
                    <form onSubmit={handleSubmit}>
                        {/* Vessel Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-icon">🚢</span>
                                Vessel Information
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="vesselName" className="form-label required">Vessel Name</label>
                                    <input
                                        type="text"
                                        id="vesselName"
                                        name="vesselName"
                                        className={`form-input ${errors.vesselName ? 'error' : ''}`}
                                        placeholder="Enter vessel name"
                                        value={formData.vesselName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.vesselName && <span className="form-error">{errors.vesselName}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="numberOfJumboJets" className="form-label required">Number of Jumbo Jets</label>
                                    <input
                                        type="number"
                                        id="numberOfJumboJets"
                                        name="numberOfJumboJets"
                                        className={`form-input ${errors.numberOfJumboJets ? 'error' : ''}`}
                                        placeholder="Enter number"
                                        min="0"
                                        value={formData.numberOfJumboJets}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.numberOfJumboJets && <span className="form-error">{errors.numberOfJumboJets}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="vesselSubjectToInspection"
                                            checked={formData.vesselSubjectToInspection}
                                            onChange={handleInputChange}
                                            className="form-checkbox"
                                        />
                                        <span>Vessel subject to inspection</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-icon">📦</span>
                                Delivery Information
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="dateOfDelivery" className="form-label required">Date of Delivery</label>
                                    <input
                                        type="date"
                                        id="dateOfDelivery"
                                        name="dateOfDelivery"
                                        className={`form-input ${errors.dateOfDelivery ? 'error' : ''}`}
                                        value={formData.dateOfDelivery}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.dateOfDelivery && <span className="form-error">{errors.dateOfDelivery}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="deliveryDate" className="form-label required">Delivery Date</label>
                                    <input
                                        type="date"
                                        id="deliveryDate"
                                        name="deliveryDate"
                                        className={`form-input ${errors.deliveryDate ? 'error' : ''}`}
                                        value={formData.deliveryDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.deliveryDate && <span className="form-error">{errors.deliveryDate}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiryDate" className="form-label required">Expiry Date</label>
                                    <input
                                        type="date"
                                        id="expiryDate"
                                        name="expiryDate"
                                        className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.expiryDate && <span className="form-error">{errors.expiryDate}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="longevity" className="form-label required">Longevity</label>
                                    <input
                                        type="date"
                                        id="longevity"
                                        name="longevity"
                                        className={`form-input ${errors.longevity ? 'error' : ''}`}
                                        value={formData.longevity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.longevity && <span className="form-error">{errors.longevity}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-icon">📋</span>
                                Additional Details
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="returns" className="form-label required">Returns</label>
                                    <input
                                        type="text"
                                        id="returns"
                                        name="returns"
                                        className={`form-input ${errors.returns ? 'error' : ''}`}
                                        placeholder="Enter returns information"
                                        value={formData.returns}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.returns && <span className="form-error">{errors.returns}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="competitors" className="form-label required">Competitors</label>
                                    <input
                                        type="text"
                                        id="competitors"
                                        name="competitors"
                                        className={`form-input ${errors.competitors ? 'error' : ''}`}
                                        placeholder="List competitor names"
                                        value={formData.competitors}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.competitors && <span className="form-error">{errors.competitors}</span>}
                                </div>
                            </div>

                            <div className="form-row single-column">
                                <div className="form-group">
                                    <label htmlFor="notes" className="form-label required">Notes</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        className={`form-textarea ${errors.notes ? 'error' : ''}`}
                                        placeholder="Provide any additional notes or observations..."
                                        rows="6"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <div className="char-counter">
                                        {errors.notes && <span className="form-error">{errors.notes}</span>}
                                        <span style={{ color: formData.notes.length > 1000 ? 'var(--danger)' : 'var(--text-tertiary)' }}>
                                            {formData.notes.length} / 1000 characters
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Photo Upload Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-icon">📸</span>
                                Photos
                            </h3>

                            <div className="form-row single-column">
                                <div className="form-group">
                                    <label htmlFor="photos" className="form-label">Photos to be uploaded</label>
                                    <input
                                        type="file"
                                        id="photos"
                                        name="photos"
                                        className="form-input"
                                        accept="image/*"
                                        multiple
                                        onChange={handleInputChange}
                                    />
                                    {formData.photos.length > 0 && (
                                        <div className="file-list">
                                            <p className="file-count">Selected {formData.photos.length} photo(s):</p>
                                            <ul>
                                                {formData.photos.map((file, index) => (
                                                    <li key={index}>{file.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={handleReset}>
                                Reset Form
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner spinner-sm"></span>
                                    </>
                                ) : (
                                    'Submit Report'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Success Modal */}
            {showModal && submittedReport && (
                <div className="modal-overlay active" onClick={(e) => e.target.className.includes('modal-overlay') && handleCloseModal()}>
                    <div className="modal">
                        <div className="modal-body">
                            <div className="success-modal-content">
                                <div className="success-icon">✓</div>
                                <h2 className="success-title">Report Submitted!</h2>
                                <p className="success-message">Your delivery report has been successfully submitted and saved.</p>

                                <div className="report-summary">
                                    <div className="summary-item">
                                        <span className="summary-label">Report ID:</span>
                                        <span className="summary-value">{submittedReport.id}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Submitted:</span>
                                        <span className="summary-value">{formatDateTime(submittedReport.submittedAt)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Vessel Name:</span>
                                        <span className="summary-value">{submittedReport.vesselName}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Date of Delivery:</span>
                                        <span className="summary-value">{formatDate(submittedReport.dateOfDelivery)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Photos Uploaded:</span>
                                        <span className="summary-value">{submittedReport.photoFileNames?.length || 0}</span>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button className="btn btn-primary btn-block" onClick={handleCloseModal}>
                                        Submit Another Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
