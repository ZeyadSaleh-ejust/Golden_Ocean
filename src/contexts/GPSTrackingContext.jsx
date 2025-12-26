import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useOrder } from './OrderContext'
import { useAuth } from '../hooks/useAuth'
import { createLocationUpdate } from '../utils/orderUtils'
import { GPS_CONFIG } from '../utils/constants'

const GPSTrackingContext = createContext(null)

export function GPSTrackingProvider({ children }) {
    const { selectedOrderId } = useOrder()
    const { currentUser } = useAuth()
    const [location, setLocation] = useState(null)
    const [error, setError] = useState(null)
    const [isTracking, setIsTracking] = useState(false)
    const [permission, setPermission] = useState('prompt') // 'prompt', 'granted', 'denied'
    const watchIdRef = useRef(null)

    const startTracking = useCallback(async () => {
        if (!selectedOrderId || !currentUser) {
            setError('Order ID and User are required')
            return false
        }

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            setPermission('denied')
            return false
        }

        try {
            // Request permission and get initial position
            const initialPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: GPS_CONFIG.GPS_TIMEOUT,
                    maximumAge: 0
                })
            })

            // Permission granted
            setPermission('granted')
            setError(null)

            // Process initial location
            const initialLocation = {
                lat: initialPosition.coords.latitude,
                lng: initialPosition.coords.longitude,
                accuracy: initialPosition.coords.accuracy
            }
            setLocation(initialLocation)

            // Save initial location
            createLocationUpdate(selectedOrderId, currentUser.id, initialLocation)

            // Start watching position
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }
                    setLocation(newLocation)

                    // Save location update
                    createLocationUpdate(selectedOrderId, currentUser.id, newLocation)
                },
                (err) => {
                    console.error('GPS tracking error:', err)
                    setError(getErrorMessage(err))
                },
                {
                    enableHighAccuracy: true,
                    timeout: GPS_CONFIG.GPS_TIMEOUT,
                    maximumAge: GPS_CONFIG.MAXIMUM_GPS_AGE
                }
            )

            setIsTracking(true)
            return true
        } catch (err) {
            console.error('Failed to start GPS tracking:', err)
            setError(getErrorMessage(err))
            setPermission('denied')
            setIsTracking(false)
            return false
        }
    }, [selectedOrderId, currentUser])

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        setIsTracking(false)
        setLocation(null)
    }, [])

    // Cleanup on unmount or when user/order changes
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
                watchIdRef.current = null
            }
        }
    }, [])

    // Stop tracking when order is cleared or user logs out
    useEffect(() => {
        if (!selectedOrderId || !currentUser) {
            stopTracking()
        }
    }, [selectedOrderId, currentUser, stopTracking])

    const value = {
        location,
        error,
        isTracking,
        permission,
        startTracking,
        stopTracking
    }

    return (
        <GPSTrackingContext.Provider value={value}>
            {children}
        </GPSTrackingContext.Provider>
    )
}

export function useGPSContext() {
    const context = useContext(GPSTrackingContext)
    if (!context) {
        throw new Error('useGPSContext must be used within GPSTrackingProvider')
    }
    return context
}

function getErrorMessage(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Location permission denied. Please enable location access in your browser settings.'
        case error.POSITION_UNAVAILABLE:
            return 'Location information is unavailable. Please check your GPS settings.'
        case error.TIMEOUT:
            return 'Location request timed out. Please try again.'
        default:
            return 'An unknown error occurred while accessing your location.'
    }
}
