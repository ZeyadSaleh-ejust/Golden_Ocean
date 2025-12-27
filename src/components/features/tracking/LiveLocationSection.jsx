import OfficerLocationMap from './OfficerLocationMap'
import { calculateDistance, formatCoordinate } from '../../../utils/orderUtils'
import { formatDateTime } from '../../../utils/authUtils'

/**
 * LiveLocationSection Component
 * Displays the live location map and metadata for an order
 */
export default function LiveLocationSection({
    selectedLocation,
    selectedOrder,
    isLoaded,
    loadError
}) {
    return (
        <div className="detail-section">
            <h4>📍 Live Location</h4>
            <div className="officer-location-map-container">
                <OfficerLocationMap
                    location={selectedLocation.location}
                    destination={selectedOrder.destination}
                    accuracy={selectedLocation.accuracy}
                    isLoaded={isLoaded}
                    loadError={loadError}
                />
            </div>
            <div className="location-meta">
                <div className="meta-item">
                    <span className="meta-icon">🎯</span>
                    <span className="meta-text">
                        {formatCoordinate(selectedLocation.location.lat, 'lat')}, {formatCoordinate(selectedLocation.location.lng, 'lng')}
                    </span>
                </div>
                {selectedLocation.accuracy && (
                    <div className="meta-item">
                        <span className="meta-icon">📊</span>
                        <span className="meta-text">Accuracy: ±{Math.round(selectedLocation.accuracy)}m</span>
                    </div>
                )}
                <div className="meta-item">
                    <span className="meta-icon">🕒</span>
                    <span className="meta-text">Updated: {formatDateTime(selectedLocation.timestamp)}</span>
                </div>
            </div>
        </div>
    )
}
