import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { assignOrderToOfficer, getStatusDisplay, getStatusColor } from '../utils/orderUtils'
import { formatDate } from '../utils/authUtils'
import '../styles/navigation.css'
import '../styles/map.css'

export default function OrderSelectionPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { assignedOrders, selectOrder } = useOrder()
    const [selectedId, setSelectedId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Filter orders available for this officer
    const availableOrders = assignedOrders.filter(
        order => order.status === 'assigned' || order.assignedTo === currentUser.id
    )

    const handleSelectOrder = (orderId) => {
        setSelectedId(orderId)
    }

    const handleConfirmSelection = () => {
        if (!selectedId) return

        setIsLoading(true)

        // Assign order to current officer
        const assignedOrder = assignOrderToOfficer(selectedId, currentUser.id)

        if (assignedOrder) {
            // Update context
            selectOrder(selectedId)

            // Navigate to tracking page after short delay
            setTimeout(() => {
                navigate('/navigation-officer/tracking')
            }, 500)
        }
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout()
            navigate('/', { replace: true })
        }
    }

    return (
        <div className="navigation-page">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="header-icon">⚓</div>
                        <div className="header-text">
                            <h1>Navigation Officer</h1>
                            <p>Select your delivery order</p>
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
                    <h2>Select Your Delivery Order</h2>
                    <p>Choose an order to begin tracking and delivery</p>
                </div>

                {availableOrders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Orders Available</h3>
                        <p>There are currently no orders assigned to you. Please check back later.</p>
                    </div>
                ) : (
                    <div className="order-selection-container">
                        <div className="order-grid">
                            {availableOrders.map(order => (
                                <div
                                    key={order.id}
                                    className={`order-card ${selectedId === order.id ? 'selected' : ''} ${order.assignedTo === currentUser.id ? 'assigned-to-me' : ''}`}
                                    onClick={() => handleSelectOrder(order.id)}
                                >
                                    <div className="order-card-header">
                                        <h3 className="order-id">{order.id}</h3>
                                        <span className={`badge badge-${getStatusColor(order.status)}`}>
                                            {getStatusDisplay(order.status)}
                                        </span>
                                    </div>

                                    <div className="order-card-body">
                                        <div className="order-detail">
                                            <span className="detail-icon">👤</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Customer</span>
                                                <span className="detail-value">{order.customerName}</span>
                                            </div>
                                        </div>

                                        <div className="order-detail">
                                            <span className="detail-icon">📍</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Destination</span>
                                                <span className="detail-value">{order.destination.name}</span>
                                            </div>
                                        </div>

                                        <div className="order-detail">
                                            <span className="detail-icon">📅</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Est. Delivery</span>
                                                <span className="detail-value">
                                                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {order.assignedTo === currentUser.id && (
                                            <div className="assigned-indicator">
                                                <span className="indicator-icon">✓</span>
                                                Currently Assigned to You
                                            </div>
                                        )}
                                    </div>

                                    <div className="order-card-footer">
                                        {selectedId === order.id && (
                                            <div className="selection-indicator">
                                                <span className="check-icon">✓</span>
                                                Selected
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="selection-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                disabled={!selectedId || isLoading}
                                onClick={handleConfirmSelection}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner spinner-sm"></span>
                                        Confirming...
                                    </>
                                ) : (
                                    <>Continue with Selected Order</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
