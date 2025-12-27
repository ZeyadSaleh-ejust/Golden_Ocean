import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../contexts/OrderContext'
import { generateOrderId } from '../utils/orderUtils'
import { ROLES } from '../utils/authUtils'
import { validateField } from '../utils/validators'
import OrderCard from '../components/features/orders/OrderCard'
import { BackIcon, BatchIcon, PlusIcon, CheckIcon } from '../components/common/Icons'
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
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i]
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
        if (!validateOrders()) {
            return
        }

        // Convert form data to order format
        const newOrders = orders.map(order => {
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

        // Add to existing orders
        const updatedOrders = [...assignedOrders, ...newOrders]
        setAssignedOrders(updatedOrders)

        // Also manually update localStorage to ensure persistence
        localStorage.setItem('golden_ocean_assigned_orders', JSON.stringify(updatedOrders))

        // Show success and reset
        setShowSuccess(true)
        setTimeout(() => {
            setShowSuccess(false)
            setOrders([createEmptyOrder()])
        }, 2000)
    }

    const handleCancel = () => {
        if (confirm('Discard all orders?')) {
            setOrders([createEmptyOrder()])
        }
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout()
            navigate('/', { replace: true })
        }
    }

    return (
        <div className="manager-page">
            {/* Header */}
            <header className="manager-header">
                <button className="back-btn" onClick={handleLogout} aria-label="Logout">
                    <BackIcon />
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
                            <BatchIcon />
                            <span>{orders.length} Item{orders.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Order Cards */}
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <OrderCard
                                key={index}
                                index={index}
                                order={order}
                                isRemovable={orders.length > 1}
                                onRemove={handleRemoveOrder}
                                onChange={handleOrderChange}
                                officers={navigationOfficers}
                            />
                        ))}

                        {/* Add Another Order Button */}
                        <button className="add-order-btn" onClick={handleAddOrder}>
                            <PlusIcon />
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
                        <CheckIcon />
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
