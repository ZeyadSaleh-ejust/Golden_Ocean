/**
 * OrderListSidebar Component
 * Displays the list of active orders with live tracking indicators
 */
export default function OrderListSidebar({
    orders,
    locations,
    selectedOrderId,
    lastUpdate,
    onSelectOrder
}) {
    return (
        <aside className="order-sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">Active Orders</h2>
                <p className="sidebar-subtitle">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="sidebar-empty">
                    <div className="empty-icon">📦</div>
                    <p>No active orders</p>
                </div>
            ) : (
                <div className="order-list">
                    {orders.map(order => {
                        const orderLocation = locations.find(loc => loc.orderId === order.id)
                        const hasTracking = !!orderLocation

                        return (
                            <div
                                key={order.id}
                                className={`order-item ${selectedOrderId === order.id ? 'active' : ''} ${hasTracking ? 'tracking' : ''}`}
                                onClick={() => onSelectOrder(order.id)}
                            >
                                <div className="order-header">
                                    <span className="order-id">{order.id}</span>
                                    {hasTracking && (
                                        <span className="tracking-badge">
                                            <span className="pulse-dot-small"></span>
                                            LIVE
                                        </span>
                                    )}
                                </div>
                                <div className="order-details">
                                    <div className="detail">
                                        <span className="detail-icon">📍</span>
                                        <span className="detail-text">{order.destination?.name || 'N/A'}</span>
                                    </div>
                                    {order.assignedTo && (
                                        <div className="detail">
                                            <span className="detail-icon">👤</span>
                                            <span className="detail-text">{order.assignedTo}</span>
                                        </div>
                                    )}
                                    {orderLocation && (
                                        <div className="detail">
                                            <span className="detail-icon">🕒</span>
                                            <span className="detail-text">
                                                {new Date(orderLocation.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {lastUpdate && (
                <div className="sidebar-footer">
                    <small>Last update: {new Date(lastUpdate).toLocaleTimeString()}</small>
                </div>
            )}
        </aside>
    )
}
