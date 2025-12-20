import { useState, useEffect, useCallback } from 'react'
import { updateOrderLocation } from '../utils/orderUtils'

export function useOrderTracking(orderId, updateInterval = 3000) {
    const [order, setOrder] = useState(null)
    const [lastUpdate, setLastUpdate] = useState(null)

    const updateLocation = useCallback(() => {
        if (orderId) {
            const updatedOrder = updateOrderLocation(orderId)
            if (updatedOrder) {
                setOrder(updatedOrder)
                setLastUpdate(new Date().toISOString())
            }
        }
    }, [orderId])

    useEffect(() => {
        if (!orderId) {
            setOrder(null)
            return
        }

        // Initial update
        updateLocation()

        // Set up interval for periodic updates
        const intervalId = setInterval(updateLocation, updateInterval)

        // Cleanup on unmount or when orderId changes
        return () => clearInterval(intervalId)
    }, [orderId, updateInterval, updateLocation])

    return { order, lastUpdate }
}
