import OfficerLocationMap from './OfficerLocationMap'

/**
 * SelectedOrderMapView Component
 * 
 * The primary center panel view for Admin Dashboard.
 * Displays ONLY the live location map for a single selected order.
 * Shows two markers: current location (green) and destination (red).
 * 
 * Renders empty state if no order is selected.
 */
export default function SelectedOrderMapView({
    selectedOrder,
    selectedLocation,
    isLoaded,
    loadError,
}) {
    // No order selected - show prompt
    if (!selectedOrder) {
        return (
            <div className="no-order-selected">
                <div className="no-order-content">
                    <div className="no-order-icon">🗺️</div>
                    <h2>Select an Order</h2>
                    <p>Choose an order from the list to view its live location</p>
                </div>
            </div>
        )
    }

    // Order selected but no location data - show message
    if (!selectedLocation) {
        return (
            <div className="no-order-selected">
                <div className="no-order-content">
                    <div className="no-order-icon">📡</div>
                    <h2>No Active Tracking</h2>
                    <p>Order {selectedOrder.id} is not currently being tracked</p>
                    {selectedOrder.assignedTo && (
                        <p className="assigned-text">Assigned to: {selectedOrder.assignedTo}</p>
                    )}
                </div>
            </div>
        )
    }

    // Order selected and location available - show map only
    return (
        <div className="selected-order-map-only">
            <OfficerLocationMap
                location={selectedLocation.location}
                destination={selectedOrder.destination}
                accuracy={selectedLocation.accuracy}
                isLoaded={isLoaded}
                loadError={loadError}
            />
        </div>
    )
}
