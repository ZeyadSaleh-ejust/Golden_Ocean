import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useOrderTracking } from '../hooks/useOrderTracking'
import {
    initializeMockOrders,
    formatCoordinate,
    calculateDistance,
    getStatusDisplay
} from '../utils/orderUtils'
import { formatDateTime } from '../utils/authUtils'
import '../styles/admin.css'

export default function AdminPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const [orders, setOrders] = useLocalStorage('golden_ocean_orders', [])
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const { order: selectedOrder } = useOrderTracking(selectedOrderId, 3000)

    // Initialize orders on first load
    useEffect(() => {
        if (orders.length === 0) {
            const mockOrders = initializeMockOrders()
            setOrders(mockOrders)
        }
    }, [])

    // Sort orders: in-transit first, then by creation date
    const sortedOrders = [...orders].sort((a, b) => {
        if (a.status === 'in-transit' && b.status !== 'in-transit') return -1
        if (a.status !== 'in-transit' && b.status === 'in-transit') return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    const handleSelectOrder = (orderId) => {
        setSelectedOrderId(orderId)
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout()
            navigate('/', { replace: true })
        }
    }

    return (
        <div className="admin-page">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="header-icon">👨‍💼</div>
                        <div className="header-text">
                            <h1>Admin Dashboard</h1>
                            <p>Live order location tracking</p>
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

            <div className="admin-layout">
                {/* Order List Sidebar */}
                <aside className="order-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Active Orders</h2>
                        <p className="sidebar-subtitle">{orders.length} orders</p>
                    </div>
                    <div className="order-list">
                        {sortedOrders.map(order => (
                            <div
                                key={order.id}
                                className={`order-item ${selectedOrderId === order.id ? 'active' : ''}`}
                                onClick={() => handleSelectOrder(order.id)}
                            >
                                <div className="order-id">
                                    {order.id}
                                    <span className={`order-status-badge ${order.status}`}>
                                        {getStatusDisplay(order.status)}
                                    </span>
                                </div>
                                <div className="order-meta">
                                    <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Tracking View */}
                <main className="tracking-view">
                    <div className="tracking-content">
                        {!selectedOrder ? (
                            <div className="tracking-empty">
                                <div className="empty-icon">📍</div>
                                <p className="empty-text">Select an order to view live location tracking</p>
                            </div>
                        ) : (
                            <div className="order-details-card">
                                <div className="order-header">
                                    <div className="order-title-section">
                                        <h2>{selectedOrder.id}</h2>
                                        <p className="order-subtitle">
                                            <span className={`badge badge-${selectedOrder.status === 'in-transit' ? 'primary' : selectedOrder.status === 'delivered' ? 'success' : 'warning'}`}>
                                                {getStatusDisplay(selectedOrder.status)}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Live Location Section */}
                                <div className="location-section">
                                    <div className="section-header">
                                        <div className="section-title-flex">
                                            <h3>📍 Live Location</h3>
                                            <div className="live-indicator">
                                                <span className="pulse-dot"></span>
                                                <span>LIVE</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="location-display">
                                        <div className="location-item">
                                            <div className="location-label">Latitude</div>
                                            <div className="location-value">
                                                {formatCoordinate(selectedOrder.currentLocation.lat, 'lat')}
                                            </div>
                                        </div>
                                        <div className="location-item">
                                            <div className="location-label">Longitude</div>
                                            <div className="location-value">
                                                {formatCoordinate(selectedOrder.currentLocation.lng, 'lng')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="last-updated">
                                        Last updated: <span className="update-time">{formatDateTime(selectedOrder.lastUpdated)}</span>
                                    </div>

                                    {/* Visual location marker */}
                                    <div className="location-map">
                                        <div className="map-marker">📍</div>
                                        <div className="coordinates-text">
                                            {selectedOrder.currentLocation.lat.toFixed(6)}, {selectedOrder.currentLocation.lng.toFixed(6)}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="info-grid">
                                    <div className="info-item">
                                        <div className="info-label">Distance to Destination</div>
                                        <div className="info-value">
                                            {calculateDistance(selectedOrder.currentLocation, selectedOrder.destination)} km
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">Estimated Delivery</div>
                                        <div className="info-value">
                                            {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">Order Created</div>
                                        <div className="info-value">
                                            {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
