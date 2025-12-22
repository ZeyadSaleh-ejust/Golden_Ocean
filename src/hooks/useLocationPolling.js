import { useState, useEffect, useCallback } from 'react'
import { getLatestLocations } from '../utils/orderUtils'

export function useLocationPolling(interval = 5000) {
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
