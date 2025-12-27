import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { generateOrderId } from '../utils/orderUtils'
import { ROLES } from '../utils/authUtils'
import '../styles/manager.css'

export default function ManagerPage() {
    const navigate = useNavigate()
    const { currentUser, logout, users } = useAuth()
    const { assignedOrders, setAssignedOrders } = useOrder()

    // Get all navigation officers for the dropdown
    const navigationOfficers = users.filter(user => user.role === ROLES.NAVIGATION_OFFICER)

    // Initialize with one empty order
    const createEmptyOrder = () => ({
        id: generateOrderId(),
        navigator: '',
        pickupLocation: '',
        orderNo: generateOrderId(),
        shipName: '',
        etaDate: '',
        etaTime: ''
    })

    const [orders, setOrders] = useState([createEmptyOrder()])
    const [showSuccess, setShowSuccess] = useState(false)

    const handleOrderChange = (index, field, value) => {
        const updatedOrders = [...orders]
        updatedOrders[index][field] = value
        setOrders(updatedOrders)
    }

    const handleAddOrder = () => {
        setOrders([...orders, createEmptyOrder()])
    }

    const handleRemoveOrder = (index) => {
        if (orders.length > 1) {
            setOrders(orders.filter((_, i) => i !== index))
        }
    }

    const validateOrders = () => {
        console.log('Validating orders:', orders)
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i]
            console.log(`Order #${i + 1}:`, order)
            if (!order.navigator || !order.pickupLocation || !order.orderNo ||
                !order.shipName || !order.etaDate || !order.etaTime) {
                const missingFields = []
                if (!order.navigator) missingFields.push('Navigator')
                if (!order.pickupLocation) missingFields.push('Pick Up Location')
                if (!order.orderNo) missingFields.push('Order No')
                if (!order.shipName) missingFields.push('Ship Name')
                if (!order.etaDate) missingFields.push('ETA Date')
                if (!order.etaTime) missingFields.push('ETA Time')
                alert(`Please fill all fields in Order #${i + 1}. Missing: ${missingFields.join(', ')}`)
                return false
            }
        }
        return true
    }

    const handleSubmit = () => {
        console.log('Submit button clicked')
        console.log('Current orders state:', orders)

        if (!validateOrders()) {
            console.log('Validation failed')
            return
        }

        console.log('Validation passed, creating orders...')

        // Convert form data to order format
        const newOrders = orders.map(order => {
            // Combine date and time for estimatedDelivery
            const etaDateTime = new Date(`${order.etaDate}T${order.etaTime}`)

            return {
                id: order.orderNo,
                status: 'assigned',
                destination: {
                    name: order.pickupLocation,
                    lat: 25.2048, // Default Dubai coordinates
                    lng: 55.2708
                },
                assignedTo: null,
                createdAt: new Date().toISOString(),
                estimatedDelivery: etaDateTime.toISOString(),
                customerName: order.navigator,
                deliveryAddress: order.pickupLocation,
                shipName: order.shipName,
                createdBy: currentUser.username,
                createdById: currentUser.id
            }
        })

        console.log('New orders to be added:', newOrders)
        console.log('Current assigned orders:', assignedOrders)

        // Add to existing orders
        const updatedOrders = [...assignedOrders, ...newOrders]
        console.log('Updated orders array:', updatedOrders)

        setAssignedOrders(updatedOrders)

        // Also manually update localStorage to ensure persistence
        localStorage.setItem('golden_ocean_assigned_orders', JSON.stringify(updatedOrders))
        console.log('Orders saved to localStorage')

        // Show success and reset
        setShowSuccess(true)
        setTimeout(() => {
            setShowSuccess(false)
            setOrders([createEmptyOrder()])
        }, 2000)
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout()
            navigate('/', { replace: true })
        }
    }

    const handleCancel = () => {
        if (confirm('Discard all orders?')) {
            setOrders([createEmptyOrder()])
        }
    }

    return (
        <div className="manager-page">
            {/* Header */}
            <header className="manager-header">
                <button className="back-btn" onClick={() => navigate('/')} aria-label="Back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="header-title">Create Batch Orders</h1>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </header>

            {/* Main Content */}
            <main className="manager-content">
                <div className="content-wrapper">
                    {/* Batch Summary */}
                    <div className="batch-summary">
                        <h3>Batch Summary</h3>
                        <div className="order-count-badge">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            <span>{orders.length} Item{orders.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Order Cards */}
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <div key={index} className="order-card">
                                {/* Card Header */}
                                <div className="card-header">
                                    <div className="order-number-badge">
                                        <span className="badge-num">{index + 1}</span>
                                        <span className="badge-text">Order #{index + 1}</span>
                                    </div>
                                    {orders.length > 1 && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleRemoveOrder(index)}
                                            aria-label="Delete order"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Card Body - Form Fields */}
                                <div className="card-body">
                                    {/* Navigator Dropdown */}
                                    <div className="form-field">
                                        <label>Navigator</label>
                                        <div className="input-wrapper">
                                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            <select
                                                value={order.navigator}
                                                onChange={(e) => handleOrderChange(index, 'navigator', e.target.value)}
                                            >
                                                <option value="">Select Navigator</option>
                                                {navigationOfficers.map(officer => (
                                                    <option key={officer.id} value={officer.username}>
                                                        Capt. {officer.username.charAt(0).toUpperCase() + officer.username.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            <svg className="dropdown-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Pickup Location */}
                                    <div className="form-field">
                                        <label>Pick Up Location</label>
                                        <div className="input-wrapper">
                                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Enter location name"
                                                value={order.pickupLocation}
                                                onChange={(e) => handleOrderChange(index, 'pickupLocation', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Order No & Ship Name Row */}
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Order No.</label>
                                            <input
                                                type="text"
                                                placeholder="ORD-000"
                                                value={order.orderNo}
                                                onChange={(e) => handleOrderChange(index, 'orderNo', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Ship Name</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M2 21h20M3 7l5 2v6l-5-2V7zM8 9l8-3v6l-8 3V9zM16 6l5 2v6l-5-2V6z" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    placeholder="Ship Name"
                                                    value={order.shipName}
                                                    onChange={(e) => handleOrderChange(index, 'shipName', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ETA Date & Time Row */}
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>ETA Date</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                                <input
                                                    type="date"
                                                    value={order.etaDate}
                                                    onChange={(e) => handleOrderChange(index, 'etaDate', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-field">
                                            <label>ETA Time</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <input
                                                    type="time"
                                                    value={order.etaTime}
                                                    onChange={(e) => handleOrderChange(index, 'etaTime', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Another Order Button */}
                        <button className="add-order-btn" onClick={handleAddOrder}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span>Add another order</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer with Submit Button */}
            <div className="manager-footer">
                <div className="footer-wrapper">
                    <button className="submit-btn" onClick={handleSubmit}>
                        <span>Create {orders.length} Order{orders.length !== 1 ? 's' : ''}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="success-modal">
                    <div className="success-content">
                        <div className="success-icon">✓</div>
                        <h3>Orders Created!</h3>
                        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} added successfully</p>
                    </div>
                </div>
            )}
        </div>
    )
}
