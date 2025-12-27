import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { useGPSContext } from '../contexts/GPSTrackingContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useReportForm } from '../hooks/useReportForm'
import VesselInfoSection from '../components/VesselInfoSection'
import DeliveryInfoSection from '../components/DeliveryInfoSection'
import AdditionalDetailsSection from '../components/AdditionalDetailsSection'
import FormActions from '../components/FormActions'
import ReportSuccessModal from '../components/ReportSuccessModal'
import '../styles/navigation.css'
import '../styles/report-modern.css'

export default function NavigationOfficerPage() {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { selectedOrderId, assignedOrders, clearSelectedOrder } = useOrder()
    const { stopTracking } = useGPSContext()
    const [reports, setReports] = useLocalStorage('golden_ocean_reports', [])

    // Use custom form hook
    const { formData, errors, handleInputChange, validateForm, resetForm } = useReportForm()

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [submittedReport, setSubmittedReport] = useState(null)

    // Redirect if no order selected
    useEffect(() => {
        if (!selectedOrderId) {
            navigate('/navigation-officer/select-order')
        }
    }, [selectedOrderId, navigate])

    const selectedOrder = assignedOrders.find(o => o.id === selectedOrderId)

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
            resetForm()
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        resetForm()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleBack = () => {
        // Go back to order details if coming from there, otherwise to tracking
        navigate('/navigation-officer/order-details')
    }

    if (!selectedOrder) {
        return null
    }

    return (
        <div className="report-page-modern">
            <header className="modern-header">
                <button className="back-btn" onClick={handleBack} aria-label="Back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1 className="header-title">Navigator</h1>
                <div className="header-user">
                    <span className="user-name-header">{currentUser.username}</span>
                    <div className="user-avatar-header">
                        {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="report-form-modern">
                    <h2>Submit Delivery Report</h2>
                    <p className="form-subtitle">
                        Complete all required fields for Order: <strong>{selectedOrder.id}</strong>
                    </p>

                    <div className="order-summary">
                        <h3>ORDER DETAILS</h3>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span className="summary-label">Order ID</span>
                                <span className="summary-value large">{selectedOrder.id}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Destination</span>
                                <span className="summary-value">{selectedOrder.destination.name}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Customer</span>
                                <span className="summary-value">{selectedOrder.customerName}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Priority</span>
                                <span className="summary-value">{selectedOrder.priority || 'High'}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <VesselInfoSection
                            formData={formData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                        />

                        <DeliveryInfoSection
                            formData={formData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                        />

                        <AdditionalDetailsSection
                            formData={formData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                        />

                        <FormActions onReset={handleReset} isLoading={isLoading} />
                    </form>
                </div>
            </main>

            {/* Success Modal */}
            {showModal && (
                <ReportSuccessModal
                    submittedReport={submittedReport}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}
