import { useCallback, useState } from 'react'
import { GoogleMap, Marker, InfoWindow, Polyline } from '@react-google-maps/api'
import { formatCoordinate } from '../../../utils/orderUtils'
import { formatDateTime } from '../../../utils/authUtils'
import { GPS_CONFIG, MAP_CONFIG, COLORS } from '../../../utils/constants'
import { defaultMapOptions, getCircleMarker } from '../../../utils/mapUtils'

const mapContainerStyle = {
    width: '100%',
    height: '100%'
}

export default function LiveMap({ locations, selectedOrderId, onMarkerClick, isLoaded, loadError }) {
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [map, setMap] = useState(null)

    // Fit bounds implementation...

    const onLoad = useCallback((map) => {
        setMap(map)

        // Fit bounds to show all markers
        if (locations.length > 0) {
            const bounds = new window.google.maps.LatLngBounds()
            locations.forEach(loc => {
                bounds.extend({ lat: loc.location.lat, lng: loc.location.lng })
            })
            map.fitBounds(bounds)
        }
    }, [locations])

    const onUnmount = useCallback(() => {
        setMap(null)
    }, [])

    const handleMarkerClick = (location) => {
        setSelectedMarker(location)
        if (onMarkerClick) {
            onMarkerClick(location.orderId)
        }

        // Pan to marker
        if (map) {
            map.panTo({ lat: location.location.lat, lng: location.location.lng })
        }
    }

    const getMarkerIcon = (location) => {
        const isSelected = location.orderId === selectedOrderId
        const isRecent = isLocationRecent(location.timestamp)

        return getCircleMarker({
            color: isRecent ? COLORS.SUCCESS : COLORS.WARNING,
            scale: isSelected ? 12 : 8,
            strokeColor: isSelected ? '#fff' : COLORS.DARK,
            strokeWeight: isSelected ? 3 : 2
        })
    }

    const isLocationRecent = (timestamp) => {
        const now = new Date()
        const locationTime = new Date(timestamp)
        const diffSeconds = (now - locationTime) / 1000
        return diffSeconds < GPS_CONFIG.LIVE_LOCATION_THRESHOLD
    }

    if (loadError) {
        return (
            <div className="map-error">
                <div className="error-icon">⚠️</div>
                <h3>Failed to Load Map</h3>
                <p>{loadError.message}</p>
                <p className="error-hint">
                    Please check your Google Maps API key in the .env file
                </p>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>Loading map...</p>
            </div>
        )
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={MAP_CONFIG.DUBAI_CENTER}
            zoom={MAP_CONFIG.DEFAULT_ZOOM}
            options={defaultMapOptions}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    position={{ lat: location.location.lat, lng: location.location.lng }}
                    onClick={() => handleMarkerClick(location)}
                    icon={getMarkerIcon(location)}
                    title={`Order: ${location.orderId}`}
                />
            ))}

            {selectedMarker && (
                <InfoWindow
                    position={{ lat: selectedMarker.location.lat, lng: selectedMarker.location.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <div className="map-info-window">
                        <h4>{selectedMarker.orderId}</h4>
                        <div className="info-row">
                            <span className="label">Officer:</span>
                            <span className="value">{selectedMarker.userId}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Destination:</span>
                            <span className="value">{selectedMarker.order?.destination?.name || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Location:</span>
                            <span className="value">
                                {formatCoordinate(selectedMarker.location.lat, 'lat')}<br />
                                {formatCoordinate(selectedMarker.location.lng, 'lng')}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="label">Last Update:</span>
                            <span className="value">{formatDateTime(selectedMarker.timestamp)}</span>
                        </div>
                        {selectedMarker.accuracy && (
                            <div className="info-row">
                                <span className="label">Accuracy:</span>
                                <span className="value">±{Math.round(selectedMarker.accuracy)}m</span>
                            </div>
                        )}
                        <div className="info-status">
                            {isLocationRecent(selectedMarker.timestamp) ? (
                                <span className="status-live">🟢 LIVE</span>
                            ) : (
                                <span className="status-stale">🟡 Last seen {getTimeSince(selectedMarker.timestamp)}</span>
                            )}
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    )
}

function getTimeSince(timestamp) {
    const now = new Date()
    const then = new Date(timestamp)
    const diffSeconds = Math.floor((now - then) / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
}
