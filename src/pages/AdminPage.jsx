import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { useLocationPolling } from '../hooks/useLocationPolling'
import { useLoadScript } from '@react-google-maps/api'
import LiveMap from '../components/features/tracking/LiveMap'
import OrderListSidebar from '../components/features/orders/OrderListSidebar'
import OrderDetailsPanel from '../components/features/orders/OrderDetailsPanel'
import { getLocationHistory } from '../utils/orderUtils'
import '../styles/admin.css'
import '../styles/admin-maps.css'

export default function AdminPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { assignedOrders } = useOrder()
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const { locations, isLoading, lastUpdate } = useLocationPolling()

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
                <OrderListSidebar
                    orders={allOrders}
                    locations={locations}
                    selectedOrderId={selectedOrderId}
                    lastUpdate={lastUpdate}
                    onSelectOrder={handleSelectOrder}
                />

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
                        <OrderDetailsPanel
                            selectedOrder={selectedOrder}
                            selectedLocation={selectedLocation}
                            locationHistory={locationHistory}
                            isLoaded={isLoaded}
                            loadError={loadError}
                            onClose={() => setSelectedOrderId(null)}
                        />
                    )}
                </main>
            </div>
        </div>
    )
}
