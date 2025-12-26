/**
 * TrackingHistorySection Component
 * Displays statistics about the tracking history
 */
export default function TrackingHistorySection({ locationHistory }) {
    if (locationHistory.length <= 1) return null

    const durationMinutes = Math.round(
        (new Date(locationHistory[locationHistory.length - 1].timestamp) -
            new Date(locationHistory[0].timestamp)) / 60000
    )

    return (
        <div className="detail-section">
            <h4>📊 Tracking History</h4>
            <div className="history-stats">
                <div className="stat">
                    <span className="stat-value">{locationHistory.length}</span>
                    <span className="stat-label">Updates</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{durationMinutes}</span>
                    <span className="stat-label">Minutes</span>
                </div>
            </div>
        </div>
    )
}
