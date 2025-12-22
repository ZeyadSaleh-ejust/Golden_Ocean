import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { validateField, validateDateRange } from '../utils/validators'
import { formatDate, formatDateTime } from '../utils/authUtils'
import '../styles/navigation.css'

export default function NavigationOfficerPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { selectedOrderId, assignedOrders, clearSelectedOrder } = useOrder()
    const [reports, setReports] = useLocalStorage('golden_ocean_reports', [])

    // Redirect if no order selected
    useEffect(() => {
        if (!selectedOrderId) {
            navigate('/navigation-officer/select-order')
        }
    }, [selectedOrderId, navigate])

    const selectedOrder = assignedOrders.find(o => o.id === selectedOrderId)

    const [formData, setFormData] = useState({
        deliveryDate: '',
        expiryDate: '',
        returns: '',
        durationOfStay: '',
        downloadRate: '',
        screenshotRate: '',
        numberOfGames: '',
        competitors: '',
        review: ''
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [submittedReport, setSubmittedReport] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

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
                returns: parseInt(formData.returns),
                downloadRate: parseFloat(formData.downloadRate),
                screenshotRate: parseFloat(formData.screenshotRate),
                numberOfGames: parseInt(formData.numberOfGames)
            }

            setReports([...reports, report])
            setSubmittedReport(report)
            setIsLoading(false)
            setShowModal(true)

            // Clear selected order after submission
            clearSelectedOrder()
        }, 800)
    }

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            setFormData({
                deliveryDate: '',
                expiryDate: '',
                returns: '',
                durationOfStay: '',
                downloadRate: '',
                screenshotRate: '',
                numberOfGames: '',
                competitors: '',
                review: ''
            })
            setErrors({})
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setFormData({
            deliveryDate: '',
            expiryDate: '',
            returns: '',
            durationOfStay: '',
            downloadRate: '',
            screenshotRate: '',
            numberOfGames: '',
            competitors: '',
            review: ''
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
                        {/* Delivery Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-icon">📦</span>
                                Delivery Information
                            </h3>

                            <div className="form-row">
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
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="returns" className="form-label required">Returns</label>
                                    <input
                                        type="number"
                                        id="returns"
                                        name="returns"
                                        className={`form-input ${errors.returns ? 'error' : ''}`}
                                        placeholder="Number of returns"
                                        min="0"
                                        value={formData.returns}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.returns && <span className="form-error">{errors.returns}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="durationOfStay" className="form-label required">Duration of Stay</label>
                                    <input
                                        type="text"
                                        id="durationOfStay"
                                        name="durationOfStay"
                                        className={`form-input ${errors.durationOfStay ? 'error' : ''}`}
                                        placeholder="e.g., 2 hours, 3 days, etc."
                                        value={formData.durationOfStay}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.durationOfStay && <span className="form-error">{errors.durationOfStay}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-icon">📊</span>
                                Performance Metrics
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="downloadRate" className="form-label required">Download Rate</label>
                                    <div className="input-with-unit">
                                        <input
                                            type="number"
                                            id="downloadRate"
                                            name="downloadRate"
                                            className={`form-input ${errors.downloadRate ? 'error' : ''}`}
                                            placeholder="0-100"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.downloadRate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span className="input-unit">%</span>
                                    </div>
                                    {errors.downloadRate && <span className="form-error">{errors.downloadRate}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="screenshotRate" className="form-label required">Screenshot Rate</label>
                                    <div className="input-with-unit">
                                        <input
                                            type="number"
                                            id="screenshotRate"
                                            name="screenshotRate"
                                            className={`form-input ${errors.screenshotRate ? 'error' : ''}`}
                                            placeholder="0-100"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.screenshotRate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span className="input-unit">%</span>
                                    </div>
                                    {errors.screenshotRate && <span className="form-error">{errors.screenshotRate}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="numberOfGames" className="form-label required">Number of Games</label>
                                    <input
                                        type="number"
                                        id="numberOfGames"
                                        name="numberOfGames"
                                        className={`form-input ${errors.numberOfGames ? 'error' : ''}`}
                                        placeholder="Total games processed"
                                        min="0"
                                        value={formData.numberOfGames}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.numberOfGames && <span className="form-error">{errors.numberOfGames}</span>}
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
                        </div>

                        {/* Review Section */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-icon">📝</span>
                                Detailed Review
                            </h3>

                            <div className="form-row single-column">
                                <div className="form-group">
                                    <label htmlFor="review" className="form-label required">Review</label>
                                    <textarea
                                        id="review"
                                        name="review"
                                        className={`form-textarea ${errors.review ? 'error' : ''}`}
                                        placeholder="Provide a detailed review of the delivery process, challenges faced, and observations..."
                                        rows="6"
                                        value={formData.review}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <div className="char-counter">
                                        {errors.review && <span className="form-error">{errors.review}</span>}
                                        <span style={{ color: formData.review.length > 1000 ? 'var(--danger)' : 'var(--text-tertiary)' }}>
                                            {formData.review.length} / 1000 characters
                                        </span>
                                    </div>
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
                                        <span className="summary-label">Delivery Date:</span>
                                        <span className="summary-value">{formatDate(submittedReport.deliveryDate)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Games Processed:</span>
                                        <span className="summary-value">{submittedReport.numberOfGames}</span>
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
