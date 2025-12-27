/**
 * OrderDetailsSection Component
 * Displays order information like customer name, dates, etc.
 */
export default function OrderDetailsSection({ order }) {
    return (
        <div className="detail-section">
            <h4>📦 Order Details</h4>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="label">Customer</span>
                    <span className="value">{order.customerName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Created</span>
                    <span className="value">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                </div>
                {order.estimatedDelivery && (
                    <div className="detail-item full-width">
                        <span className="label">Est. Delivery</span>
                        <span className="value">
                            {new Date(order.estimatedDelivery).toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
