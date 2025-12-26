import LiveLocationSection from './LiveLocationSection'
import DestinationSection from './DestinationSection'
import TrackingHistorySection from './TrackingHistorySection'
import OrderDetailsSection from './OrderDetailsSection'

/**
 * OrderDetailsPanel Component
 * Displays detailed information about a selected order including live tracking
 */
export default function OrderDetailsPanel({
    selectedOrder,
    selectedLocation,
    locationHistory,
    isLoaded,
    loadError,
    onClose
}) {
    return (
        <div className="tracking-details-panel">
            <div className="panel-header">
                <h3>{selectedOrder.id}</h3>
                <button className="close-panel-btn" onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className="panel-content">
                {selectedLocation ? (
                    <>
                        <LiveLocationSection
                            selectedLocation={selectedLocation}
                            selectedOrder={selectedOrder}
                            isLoaded={isLoaded}
                            loadError={loadError}
                        />

                        {selectedOrder.destination && (
                            <DestinationSection
                                selectedLocation={selectedLocation}
                                destination={selectedOrder.destination}
                            />
                        )}

                        <TrackingHistorySection locationHistory={locationHistory} />
                    </>
                ) : (
                    <div className="no-tracking">
                        <div className="no-tracking-icon">📡</div>
                        <h4>No Active Tracking</h4>
                        <p>This order is not currently being tracked.</p>
                        {selectedOrder.assignedTo && (
                            <p className="tracking-info">
                                Assigned to: <strong>{selectedOrder.assignedTo}</strong>
                            </p>
                        )}
                    </div>
                )}

                <OrderDetailsSection order={selectedOrder} />
            </div>
        </div>
    )
}
