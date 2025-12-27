import { GoogleMap, Marker, Circle } from '@react-google-maps/api'
import { defaultMapOptions, getCircleMarker } from '../../../utils/mapUtils'
import { COLORS } from '../../../utils/constants'

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px'
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

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: location.lat, lng: location.lng }}
            zoom={15}
            options={defaultMapOptions}
        >
            {/* Officer current location marker */}
            <Marker
                position={{ lat: location.lat, lng: location.lng }}
                icon={getCircleMarker({
                    color: COLORS.SUCCESS,
                    scale: 10,
                    strokeColor: '#fff',
                    strokeWeight: 3
                })}
                title="Current Location"
            />

            {/* Accuracy circle */}
            {accuracy && (
                <Circle
                    center={{ lat: location.lat, lng: location.lng }}
                    radius={accuracy}
                    options={{
                        fillColor: COLORS.SUCCESS,
                        fillOpacity: 0.15,
                        strokeColor: COLORS.SUCCESS,
                        strokeOpacity: 0.5,
                        strokeWeight: 1
                    }}
                />
            )}

            {/* Destination marker if provided */}
            {destination && (
                <Marker
                    position={{ lat: destination.lat, lng: destination.lng }}
                    icon={getCircleMarker({
                        color: COLORS.DANGER,
                        scale: 8,
                        strokeColor: '#fff',
                        strokeWeight: 2
                    })}
                    title={`Destination: ${destination.name || 'Target Location'}`}
                />
            )}
        </GoogleMap>
    )
}
