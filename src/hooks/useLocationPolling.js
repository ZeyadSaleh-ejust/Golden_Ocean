import { useState, useEffect, useCallback } from 'react'
import { getLatestLocations } from '../utils/orderUtils'
import { GPS_CONFIG } from '../utils/constants'

export function useLocationPolling(interval = GPS_CONFIG.POLLING_INTERVAL) {
    const [locations, setLocations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)

    const fetchLocations = useCallback(() => {
        const latestLocations = getLatestLocations()
        setLocations(latestLocations)
        setLastUpdate(new Date().toISOString())
        setIsLoading(false)
    }, [])

    useEffect(() => {
        // Initial fetch
        fetchLocations()

        // Set up polling interval
        const intervalId = setInterval(fetchLocations, interval)

        // Cleanup
        return () => clearInterval(intervalId)
    }, [fetchLocations, interval])

    return {
        locations,
        isLoading,
        lastUpdate,
        refresh: fetchLocations
    }
}
