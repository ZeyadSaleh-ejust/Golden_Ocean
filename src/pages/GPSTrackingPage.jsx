import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { useGPSTracking } from '../hooks/useGPSTracking'
import { formatCoordinate } from '../utils/orderUtils'
import '../styles/navigation.css'
import '../styles/map.css'

export default function GPSTrackingPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { selectedOrderId, assignedOrders, clearSelectedOrder } = useOrder()
    const [permissionStep, setPermissionStep] = useState('request') // 'request', 'granted', 'denied'

    const {
        location,
        error,
        isTracking,
        permission,
        startTracking
    } = useGPSTracking(selectedOrderId, currentUser.id)

    // Redirect if no order selected
    useEffect(() => {
        if (!selectedOrderId) {
            navigate('/navigation-officer/select-order')
        }
    }, [selectedOrderId, navigate])

    // Update permission step based on GPS permission
    useEffect(() => {
        if (permission === 'granted') {
            setPermissionStep('granted')
        } else if (permission === 'denied') {
            setPermissionStep('denied')
        }
    }, [permission])

    const selectedOrder = assignedOrders.find(o => o.id === selectedOrderId)

    const handleRequestPermission = async () => {
        await startTracking()
    }

    const handleProceedToReport = () => {
        navigate('/navigation-officer/report')
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout? Location tracking will stop.')) {
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
                            <p>GPS Tracking - {selectedOrder.id}</p>
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
                {permissionStep === 'request' && (
                    <div className="gps-permission-request">
                        <div className="permission-card">
                            <div className="permission-icon">📍</div>
                            <h2>Location Permission Required</h2>
                            <p className="permission-description">
                                To track your delivery route in real-time, we need access to your device's location.
                                Your location will be shared with the admin dashboard while you're on duty.
                            </p>

                            <div className="order-info-box">
                                <h3>Current Order</h3>
                                <div className="info-row">
                                    <span className="info-label">Order ID:</span>
                                    <span className="info-value">{selectedOrder.id}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Destination:</span>
                                    <span className="info-value">{selectedOrder.destination.name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Customer:</span>
                                    <span className="info-value">{selectedOrder.customerName}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleRequestPermission}
                            >
                                Enable Location Tracking
                            </button>

                            <p className="permission-note">
                                ℹ️ Your browser will ask for location permission. Please allow it to continue.
                            </p>
                        </div>
                    </div>
                )}

                {permissionStep === 'denied' && (
                    <div className="gps-permission-denied">
                        <div className="error-card">
                            <div className="error-icon">⚠️</div>
                            <h2>Location Permission Denied</h2>
                            <p className="error-description">
                                {error || 'You denied location access. Location tracking is required to proceed.'}
                            </p>

                            <div className="error-instructions">
                                <h3>How to enable location access:</h3>
                                <ol>
                                    <li>Click the lock icon in your browser's address bar</li>
                                    <li>Find "Location" in the permissions list</li>
                                    <li>Change it to "Allow"</li>
                                    <li>Refresh this page</li>
                                </ol>
                            </div>

                            <div className="error-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleRequestPermission}
                                >
                                    Try Again
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/navigation-officer/select-order')}
                                >
                                    Back to Orders
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {permissionStep === 'granted' && (
                    <div className="gps-tracking-active">
                        <div className="tracking-success-card">
                            <div className="success-banner">
                                <div className="success-icon">✓</div>
                                <div className="success-content">
                                    <h2>Location Tracking Active</h2>
                                    <div className="live-indicator">
                                        <span className="pulse-dot"></span>
                                        <span>LIVE TRACKING</span>
                                    </div>
                                </div>
                            </div>

                            <div className="current-location-section">
                                <h3>📍 Your Current Location</h3>
                                {location ? (
                                    <div className="location-display">
                                        <div className="location-item">
                                            <span className="location-label">Latitude</span>
                                            <span className="location-value">
                                                {formatCoordinate(location.lat, 'lat')}
                                            </span>
                                        </div>
                                        <div className="location-item">
                                            <span className="location-label">Longitude</span>
                                            <span className="location-value">
                                                {formatCoordinate(location.lng, 'lng')}
                                            </span>
                                        </div>
                                        <div className="location-item">
                                            <span className="location-label">Accuracy</span>
                                            <span className="location-value">
                                                ±{location.accuracy ? Math.round(location.accuracy) : 'N/A'} meters
                                            </span>
                                        </div>
                                        <div className="location-item full-width">
                                            <span className="location-label">Coordinates</span>
                                            <span className="location-value coords">
                                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="location-loading">
                                        <span className="spinner"></span>
                                        <p>Getting your location...</p>
                                    </div>
                                )}
                            </div>

                            <div className="order-tracking-info">
                                <h3>📦 Delivery Information</h3>
                                <div className="tracking-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Order ID</span>
                                        <span className="detail-value">{selectedOrder.id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Destination</span>
                                        <span className="detail-value">{selectedOrder.destination.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Customer</span>
                                        <span className="detail-value">{selectedOrder.customerName}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Status</span>
                                        <span className="detail-value">
                                            {isTracking ? '🟢 Tracking Active' : '🔴 Not Tracking'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="tracking-notice">
                                <p>
                                    ℹ️ Your location is being tracked and sent to the admin dashboard.
                                    Continue to the delivery report when you're ready.
                                </p>
                            </div>

                            <div className="tracking-actions">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleProceedToReport}
                                    disabled={!location}
                                >
                                    Proceed to Delivery Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
