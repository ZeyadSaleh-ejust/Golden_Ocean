import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { useLocationPolling } from '../hooks/useLocationPolling'
import { useLoadScript } from '@react-google-maps/api'
import LiveMap from '../components/LiveMap'
import OfficerLocationMap from '../components/OfficerLocationMap'
import { getLocationHistory, calculateDistance, formatCoordinate } from '../utils/orderUtils'
import { formatDateTime } from '../utils/authUtils'
import '../styles/admin.css'
import '../styles/admin-maps.css'

export default function AdminPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { assignedOrders } = useOrder()
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const { locations, isLoading, lastUpdate } = useLocationPolling(5000)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    })

    // Get unique active orders from locations
    const activeOrders = locations.map(loc => loc.order).filter(Boolean)
    const uniqueOrders = Array.from(
        new Map(activeOrders.map(order => [order.id, order])).values()
    )

    // Combine with all assigned orders, prioritizing those with active tracking
    const allOrders = [
        ...uniqueOrders,
        ...assignedOrders.filter(order =>
            !uniqueOrders.find(o => o.id === order.id) &&
            order.status === 'assigned'
        )
    ]

    const selectedOrder = selectedOrderId ? allOrders.find(o => o.id === selectedOrderId) : null
    const selectedLocation = selectedOrderId ? locations.find(loc => loc.orderId === selectedOrderId) : null
    const locationHistory = selectedOrderId ? getLocationHistory(selectedOrderId) : []

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout()
            navigate('/', { replace: true })
        }
    }

    const handleSelectOrder = (orderId) => {
        setSelectedOrderId(orderId)
    }

    return (
        <div className="admin-page">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="header-icon">👨‍💼</div>
                        <div className="header-text">
                            <h1>Admin Dashboard</h1>
                            <p>Real-time GPS tracking</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <div className="live-status">
                            <span className="pulse-dot"></span>
                            <span className="status-text">
                                {locations.length} Active Officer{locations.length !== 1 ? 's' : ''}
                            </span>
                        </div>
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

            <div className="admin-layout">
                {/* Order List Sidebar */}
                <aside className="order-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Active Orders</h2>
                        <p className="sidebar-subtitle">
                            {allOrders.length} order{allOrders.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {allOrders.length === 0 ? (
                        <div className="sidebar-empty">
                            <div className="empty-icon">📦</div>
                            <p>No active orders</p>
                        </div>
                    ) : (
                        <div className="order-list">
                            {allOrders.map(order => {
                                const orderLocation = locations.find(loc => loc.orderId === order.id)
                                const hasTracking = !!orderLocation

                                return (
                                    <div
                                        key={order.id}
                                        className={`order-item ${selectedOrderId === order.id ? 'active' : ''} ${hasTracking ? 'tracking' : ''}`}
                                        onClick={() => handleSelectOrder(order.id)}
                                    >
                                        <div className="order-header">
                                            <span className="order-id">{order.id}</span>
                                            {hasTracking && (
                                                <span className="tracking-badge">
                                                    <span className="pulse-dot-small"></span>
                                                    LIVE
                                                </span>
                                            )}
                                        </div>
                                        <div className="order-details">
                                            <div className="detail">
                                                <span className="detail-icon">📍</span>
                                                <span className="detail-text">{order.destination?.name || 'N/A'}</span>
                                            </div>
                                            {order.assignedTo && (
                                                <div className="detail">
                                                    <span className="detail-icon">👤</span>
                                                    <span className="detail-text">{order.assignedTo}</span>
                                                </div>
                                            )}
                                            {orderLocation && (
                                                <div className="detail">
                                                    <span className="detail-icon">🕒</span>
                                                    <span className="detail-text">
                                                        {new Date(orderLocation.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {lastUpdate && (
                        <div className="sidebar-footer">
                            <small>Last update: {new Date(lastUpdate).toLocaleTimeString()}</small>
                        </div>
                    )}
                </aside>

                {/* Map and Details View */}
                <main className="tracking-view">
                    <div className="map-container">
                        <LiveMap
                            locations={locations}
                            selectedOrderId={selectedOrderId}
                            onMarkerClick={handleSelectOrder}
                            isLoaded={isLoaded}
                            loadError={loadError}
                        />
                    </div>

                    {selectedOrder && (
                        <div className="tracking-details-panel">
                            <div className="panel-header">
                                <h3>{selectedOrder.id}</h3>
                                <button
                                    className="close-panel-btn"
                                    onClick={() => setSelectedOrderId(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="panel-content">
                                {selectedLocation ? (
                                    <>
                                        <div className="detail-section">
                                            <h4>📍 Live Location</h4>
                                            <div className="officer-location-map-container">
                                                <OfficerLocationMap
                                                    location={selectedLocation.location}
                                                    destination={selectedOrder.destination}
                                                    accuracy={selectedLocation.accuracy}
                                                    isLoaded={isLoaded}
                                                    loadError={loadError}
                                                />
                                            </div>
                                            <div className="location-meta">
                                                <div className="meta-item">
                                                    <span className="meta-icon">🎯</span>
                                                    <span className="meta-text">
                                                        {formatCoordinate(selectedLocation.location.lat, 'lat')}, {formatCoordinate(selectedLocation.location.lng, 'lng')}
                                                    </span>
                                                </div>
                                                {selectedLocation.accuracy && (
                                                    <div className="meta-item">
                                                        <span className="meta-icon">📊</span>
                                                        <span className="meta-text">Accuracy: ±{Math.round(selectedLocation.accuracy)}m</span>
                                                    </div>
                                                )}
                                                <div className="meta-item">
                                                    <span className="meta-icon">🕒</span>
                                                    <span className="meta-text">Updated: {formatDateTime(selectedLocation.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedOrder.destination && (
                                            <div className="detail-section">
                                                <h4>🎯 Destination</h4>
                                                <div className="detail-grid">
                                                    <div className="detail-item full-width">
                                                        <span className="label">Location</span>
                                                        <span className="value">{selectedOrder.destination.name}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Distance</span>
                                                        <span className="value">
                                                            {calculateDistance(
                                                                selectedLocation.location,
                                                                { lat: selectedOrder.destination.lat, lng: selectedOrder.destination.lng }
                                                            )} km
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {locationHistory.length > 1 && (
                                            <div className="detail-section">
                                                <h4>📊 Tracking History</h4>
                                                <div className="history-stats">
                                                    <div className="stat">
                                                        <span className="stat-value">{locationHistory.length}</span>
                                                        <span className="stat-label">Updates</span>
                                                    </div>
                                                    <div className="stat">
                                                        <span className="stat-value">
                                                            {Math.round(
                                                                (new Date(locationHistory[locationHistory.length - 1].timestamp) -
                                                                    new Date(locationHistory[0].timestamp)) / 60000
                                                            )}
                                                        </span>
                                                        <span className="stat-label">Minutes</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="no-tracking">
                                        <div className="no-tracking-icon">📡</div>
                                        <h4>No Active Tracking</h4>
                                        <p>This order is not currently being tracked.</p>
                                        {selectedOrder.assignedTo && (
                                            <p className="tracking-info">
                                                Assigned to: <strong>{selectedOrder.assignedTo}</strong>
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="detail-section">
                                    <h4>📦 Order Details</h4>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="label">Customer</span>
                                            <span className="value">{selectedOrder.customerName || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Created</span>
                                            <span className="value">
                                                {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {selectedOrder.estimatedDelivery && (
                                            <div className="detail-item full-width">
                                                <span className="label">Est. Delivery</span>
                                                <span className="value">
                                                    {new Date(selectedOrder.estimatedDelivery).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
