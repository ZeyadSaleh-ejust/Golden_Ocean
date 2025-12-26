import { calculateDistance } from '../utils/orderUtils'

/**
 * DestinationSection Component
 * Displays destination information and distance calculation
 */
export default function DestinationSection({ selectedLocation, destination }) {
    return (
        <div className="detail-section">
            <h4>🎯 Destination</h4>
            <div className="detail-grid">
                <div className="detail-item full-width">
                    <span className="label">Location</span>
                    <span className="value">{destination.name}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Distance</span>
                    <span className="value">
                        {calculateDistance(
                            selectedLocation.location,
                            { lat: destination.lat, lng: destination.lng }
                        )} km
                    </span>
                </div>
            </div>
        </div>
    )
}
