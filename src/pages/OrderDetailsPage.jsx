import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import '../styles/navigation.css'
import '../styles/order-details.css'

// Order status stages configuration
const ORDER_STAGES = [
    {
        id: 1,
        title: 'Navigator arrives warehouse',
        subtitle: 'Picking up',
        icon: 'check',
        action: 'Navigator arrives warehouse'
    },
    {
        id: 2,
        title: 'Leaves warehouse',
        subtitle: 'On the way',
        icon: 'check',
        action: 'Leaves warehouse'
    },
    {
        id: 3,
        title: 'Boards ship',
        subtitle: 'On ship',
        icon: 'ship',
        action: 'Boards ship'
    },
    {
        id: 4,
        title: 'Leaves ship',
        subtitle: 'Off ship',
        icon: 'anchor',
        action: 'Leaves ship'
    },
    {
        id: 5,
        title: 'Submits report',
        subtitle: 'Reported',
        icon: 'document',
        action: 'Submits report'
    },
    {
        id: 6,
        title: 'Admin review',
        subtitle: 'Approved / Flagged',
        icon: 'check',
        action: null
    }
]

export default function OrderDetailsPage() {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { selectedOrderId, assignedOrders } = useOrder()
    const [currentStage, setCurrentStage] = useState(0)

    // Get selected order
    const selectedOrder = assignedOrders.find(o => o.id === selectedOrderId)

    // Redirect if no order selected
    if (!selectedOrderId || !selectedOrder) {
        navigate('/navigation-officer/select-order')
        return null
    }

    const handleNextAction = () => {
        if (currentStage === 4) {
            // Stage 5: "Submits report" - navigate to report page
            navigate('/navigation-officer/report')
        } else if (currentStage < 4) {
            // Move to next stage
            setCurrentStage(currentStage + 1)
        }
    }

    // Determine stage state (completed, active, pending)
    const getStageState = (stageIndex) => {
        if (stageIndex < currentStage) return 'completed'
        if (stageIndex === currentStage) return 'active'
        return 'pending'
    }

    // Get icon for stage
    const getStageIcon = (stage, state) => {
        if (state === 'completed') {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            )
        }

        switch (stage.icon) {
            case 'check':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )
            case 'ship':
                return '🚢'
            case 'anchor':
                return '⚓'
            case 'document':
                return '📄'
            default:
                return '•'
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    const handleBack = () => {
        navigate('/navigation-officer/select-order')
    }

    return (
        <div className="order-details-page">
            {/* Header */}
            <header className="order-details-header">
                <button className="back-btn" onClick={handleBack} aria-label="Back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1 className="header-title">Navigator</h1>
                <div className="header-user">
                    <div className="user-info-header">
                        <span className="user-name-header">{currentUser.username}</span>
                        <span className="user-role-header">Driver #{currentUser.id.slice(-2)}</span>
                    </div>
                    <div className="user-avatar-header">
                        {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            {/* Active Order Banner */}
            <div className="active-order-banner">
                <div className="banner-overlay">
                    <span className="active-badge">ACTIVE ORDER</span>
                </div>
            </div>

            {/* Order Details Card */}
            <div className="order-details-content">
                <div className="order-info-card">
                    {/* Order Header */}
                    <div className="order-header-section">
                        <h2 className="order-id-large">{selectedOrder.id}</h2>
                        <span className="status-badge-transit">In Transit</span>
                    </div>

                    {/* Order Meta */}
                    <p className="order-meta">
                        Priority: High • Container: 40ft HC
                    </p>

                    {/* Vessel and Arrival Info */}
                    <div className="order-details-grid">
                        <div className="detail-section">
                            <h3 className="detail-label">VESSEL</h3>
                            <div className="detail-value-row">
                                <svg className="detail-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 21c0-4 4-4 4-8V3h12v10c0 4 4 4 4 8"></path>
                                    <path d="M6 21h12"></path>
                                    <circle cx="12" cy="7" r="2"></circle>
                                </svg>
                                <span className="detail-text">MV Everest</span>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3 className="detail-label">EST. ARRIVAL</h3>
                            <div className="detail-value-row">
                                <svg className="detail-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span className="detail-text">
                                    {formatTime(selectedOrder.estimatedDelivery)}<br />
                                    {formatDate(selectedOrder.estimatedDelivery)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Status Section */}
                    <div className="order-status-section">
                        <h3 className="status-section-title">ORDER STATUS</h3>

                        <div className="status-timeline">
                            {ORDER_STAGES.map((stage, index) => {
                                const state = getStageState(index)
                                return (
                                    <div key={stage.id} className={`timeline-item ${state}`}>
                                        <div className="timeline-marker">
                                            <div className={`marker-icon ${state}`}>
                                                {getStageIcon(stage, state)}
                                            </div>
                                            {index < ORDER_STAGES.length - 1 && (
                                                <div className={`timeline-connector ${state}`}></div>
                                            )}
                                        </div>
                                        <div className="timeline-content">
                                            <h4 className={`timeline-title ${state}`}>{stage.title}</h4>
                                            <p className={`timeline-subtitle ${state}`}>{stage.subtitle}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                {currentStage < 5 && (
                    <button className="action-button-large" onClick={handleNextAction}>
                        <div className="action-button-content">
                            <div className="action-button-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                </svg>
                            </div>
                            <div className="action-button-text">
                                <span className="action-main">{ORDER_STAGES[currentStage].action}</span>
                                <span className="action-subtitle">NEXT ACTION</span>
                            </div>
                        </div>
                        <svg className="action-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}
