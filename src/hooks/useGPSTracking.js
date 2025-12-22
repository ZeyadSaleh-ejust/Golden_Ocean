import { useState, useEffect, useCallback, useRef } from 'react'
import { createLocationUpdate } from '../utils/orderUtils'

export function useGPSTracking(orderId, userId) {
    const [location, setLocation] = useState(null)
    const [error, setError] = useState(null)
    const [isTracking, setIsTracking] = useState(false)
    const [permission, setPermission] = useState('prompt') // 'prompt', 'granted', 'denied'
    const watchIdRef = useRef(null)

    const startTracking = useCallback(async () => {
        if (!orderId || !userId) {
            setError('Order ID and User ID are required')
            return
        }

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            setPermission('denied')
            return
        }

        try {
            // Request permission and get initial position
            const initialPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
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
            createLocationUpdate(orderId, userId, initialLocation)

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
                    createLocationUpdate(orderId, userId, newLocation)
                },
                (err) => {
                    console.error('GPS tracking error:', err)
                    setError(getErrorMessage(err))
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000 // Accept cached positions up to 5 seconds old
                }
            )

            setIsTracking(true)
        } catch (err) {
            console.error('Failed to start GPS tracking:', err)
            setError(getErrorMessage(err))
            setPermission('denied')
            setIsTracking(false)
        }
    }, [orderId, userId])

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        setIsTracking(false)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTracking()
        }
    }, [stopTracking])

    return {
        location,
        error,
        isTracking,
        permission,
        startTracking,
        stopTracking
    }
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
