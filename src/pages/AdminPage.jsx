import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { useLocationPolling } from '../hooks/useLocationPolling'
import { useLoadScript } from '@react-google-maps/api'
import OrderListSidebar from '../components/OrderListSidebar'
import SelectedOrderMapView from '../components/SelectedOrderMapView'
import '../styles/admin.css'
import '../styles/admin-maps.css'

/**
 * AdminPage Component
 * 
 * Main admin dashboard with two-panel layout:
 * - Left Panel: Order list sidebar (OrderListSidebar)
 * - Center Panel: Selected order's live location map only (SelectedOrderMapView)
 */
export default function AdminPage() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const { assignedOrders } = useOrder()
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const { locations, lastUpdate } = useLocationPolling()

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

    // Derived state for selected order
    const selectedOrder = selectedOrderId
        ? allOrders.find(o => o.id === selectedOrderId)
        : null
    const selectedLocation = selectedOrderId
        ? locations.find(loc => loc.orderId === selectedOrderId)
        : null

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
                {/* Left Panel: Order List */}
                <OrderListSidebar
                    orders={allOrders}
                    locations={locations}
                    selectedOrderId={selectedOrderId}
                    lastUpdate={lastUpdate}
                    onSelectOrder={handleSelectOrder}
                />

                {/* Center Panel: Selected Order Map Only */}
                <main className="tracking-view">
                    <SelectedOrderMapView
                        selectedOrder={selectedOrder}
                        selectedLocation={selectedLocation}
                        isLoaded={isLoaded}
                        loadError={loadError}
                    />
                </main>
            </div>
        </div>
    )
}
