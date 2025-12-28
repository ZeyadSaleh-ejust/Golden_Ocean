import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { assignOrderToOfficer } from '../utils/orderUtils'
import '../styles/navigation.css'

// Ship names to make the display more realistic
const SHIP_NAMES = [
    'MV Nile Star',
    'SS Voyager',
    'MV Ocean Pearl',
    'SS Golden Wave',
    'MV Blue Horizon',
    'SS Pacific Dream',
    'MV Atlantic Breeze',
    'SS Mediterranean Glory'
]

export default function OrderSelectionPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { assignedOrders, selectOrder } = useOrder()
    const [isLoading, setIsLoading] = useState(null)

    // Filter orders available for this officer - only show orders assigned to them
    const availableOrders = assignedOrders.filter(
        order => order.assignedTo === currentUser.username
    )

    // Count active orders assigned to current user
    const activeOrderCount = availableOrders.filter(
        order => order.status === 'in-transit' || order.assignedTo === currentUser.username
    ).length

    const handleStartDelivery = (orderId) => {
        setIsLoading(orderId)

        // Assign order to current officer
        const assignedOrder = assignOrderToOfficer(orderId, currentUser.id)

        if (assignedOrder) {
            // Update context
            selectOrder(orderId)

            // Navigate back to tracking page to enable GPS
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

    // Get current date formatted
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    // Format ETA time
    const formatETA = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    return (
        <div className="order-selection-page">
            {/* Profile Header */}
            <header className="profile-header">
                <div className="profile-section">
                    <button
                        className="back-btn"
                        onClick={handleLogout}
                        aria-label="Back to login"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {currentUser.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="online-indicator"></span>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">Mr. {currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)}</h2>
                        <p className="profile-date">{currentDate}</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="notification-btn" aria-label="Notifications">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {activeOrderCount > 0 && <span className="notification-badge">{activeOrderCount}</span>}
                    </button>
                </div>
            </header>

            <main className="order-selection-content">
                {/* Greeting Section */}
                <div className="greeting-section">
                    <h1 className="greeting-title">Hello, Mr. {currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)}</h1>
                    <p className="greeting-subtitle">
                        You have <span className="active-count">{activeOrderCount} active order{activeOrderCount !== 1 ? 's' : ''}</span> today.
                    </p>
                </div>

                {/* Orders List */}
                {availableOrders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Orders Available</h3>
                        <p>There are currently no orders assigned to you.</p>
                    </div>
                ) : (
                    <div className="orders-container">
                        {availableOrders.map((order, index) => {
                            // Show "Start Delivery" button for orders that are assigned (available to take) or already in-transit
                            const isActive = order.status === 'assigned' || order.status === 'in-transit'
                            const shipName = SHIP_NAMES[index % SHIP_NAMES.length]

                            return (
                                <div key={order.id} className={`order-card-modern ${isActive ? 'active' : 'pending'}`}>
                                    <div className="card-accent"></div>
                                    <div className="card-content">
                                        <div className="card-header">
                                            <span className={`status-badge ${isActive ? 'status-active' : 'status-pending'}`}>
                                                {isActive ? 'ACTIVE' : 'PENDING'}
                                            </span>
                                        </div>

                                        <div className="card-body">
                                            <h3 className="ship-name">{shipName}</h3>
                                            <p className="order-id">{order.id}</p>

                                            <div className="order-info">
                                                <div className="info-item">
                                                    <svg className="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg>
                                                    <div className="info-text-wrapper">
                                                        <span className="info-label">ETA: </span>
                                                        <span className="info-value">{formatETA(order.estimatedDelivery)}</span>
                                                    </div>
                                                </div>

                                                <div className="info-item">
                                                    <svg className="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                    <div className="info-text-wrapper">
                                                        <span className="info-label">Pickup: </span>
                                                        <span className="info-value">{order.destination.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            {isActive ? (
                                                <button
                                                    className="btn-start-delivery"
                                                    onClick={() => handleStartDelivery(order.id)}
                                                    disabled={isLoading === order.id}
                                                >
                                                    {isLoading === order.id ? (
                                                        <>Starting...</>
                                                    ) : (
                                                        <>
                                                            Start Delivery
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M22 2L11 13"></path>
                                                                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <button className="btn-view-details" onClick={() => { }}>
                                                    View Details
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
