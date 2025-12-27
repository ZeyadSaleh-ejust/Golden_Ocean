import { createContext, useContext, useState, useEffect } from 'react'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
    const [selectedOrderId, setSelectedOrderId] = useState(() => {
        const stored = localStorage.getItem('golden_ocean_selected_order')
        return stored ? JSON.parse(stored) : null
    })

    const [assignedOrders, setAssignedOrders] = useState(() => {
        const stored = localStorage.getItem('golden_ocean_assigned_orders')
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        if (selectedOrderId) {
            localStorage.setItem('golden_ocean_selected_order', JSON.stringify(selectedOrderId))
        } else {
            localStorage.removeItem('golden_ocean_selected_order')
        }
    }, [selectedOrderId])

    useEffect(() => {
        localStorage.setItem('golden_ocean_assigned_orders', JSON.stringify(assignedOrders))
    }, [assignedOrders])

    const selectOrder = (orderId) => {
        setSelectedOrderId(orderId)
    }

    const clearSelectedOrder = () => {
        setSelectedOrderId(null)
    }

    const value = {
        selectedOrderId,
        assignedOrders,
        setAssignedOrders,
        selectOrder,
        clearSelectedOrder
    }

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
    const context = useContext(OrderContext)
    if (!context) {
        throw new Error('useOrder must be used within OrderProvider')
    }
    return context
}
