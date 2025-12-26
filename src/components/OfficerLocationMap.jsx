import { GoogleMap, Marker, Circle } from '@react-google-maps/api'

const mapContainerStyle = {
    width: '100%',
    height: '100%',  // Changed to 100% for flexible sizing in different contexts
    minHeight: '300px',  // Minimum height for usability
    borderRadius: '12px'
}

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
}

export default function OfficerLocationMap({ location, destination, accuracy, isLoaded, loadError }) {

    if (loadError) {
        return (
            <div className="mini-map-error">
                <p>Failed to load map</p>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="mini-map-loading">
                <div className="spinner"></div>
            </div>
        )
    }

    // Guard against undefined location
    if (!location || typeof location.lat === 'undefined' || typeof location.lng === 'undefined') {
        return (
            <div className="mini-map-error">
                <p>Location data unavailable</p>
            </div>
        )
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: location.lat, lng: location.lng }}
            zoom={15}
            options={mapOptions}
        >
            {/* Officer current location marker */}
            <Marker
                position={{ lat: location.lat, lng: location.lng }}
                icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#10b981',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 3
                }}
                title="Current Location"
            />

            {/* Accuracy circle */}
            {accuracy && (
                <Circle
                    center={{ lat: location.lat, lng: location.lng }}
                    radius={accuracy}
                    options={{
                        fillColor: '#10b981',
                        fillOpacity: 0.15,
                        strokeColor: '#10b981',
                        strokeOpacity: 0.5,
                        strokeWeight: 1
                    }}
                />
            )}

            {/* Destination marker if provided */}
            {destination && (
                <Marker
                    position={{ lat: destination.lat, lng: destination.lng }}
                    icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#ef4444',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2
                    }}
                    title={`Destination: ${destination.name || 'Target Location'}`}
                />
            )}
        </GoogleMap>
    )
}
