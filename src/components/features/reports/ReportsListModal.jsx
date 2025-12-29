import { useState } from 'react'
import { useLocalStorage } from '../../../hooks/useLocalStorage'

export default function ReportsListModal({ onClose }) {
    const [reports] = useLocalStorage('golden_ocean_reports', [])
    const [searchTerm, setSearchTerm] = useState('')

    // Group reports by officer
    const reportsByOfficer = reports.reduce((acc, report) => {
        const officerName = report.officerName || 'Unknown Officer'
        if (!acc[officerName]) {
            acc[officerName] = []
        }
        acc[officerName].push(report)
        return acc
    }, {})

    // Filter based on search
    const filteredOfficers = Object.keys(reportsByOfficer).filter(officer =>
        officer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="reports-modal-overlay">
            <div className="reports-modal">
                <div className="reports-modal-header">
                    <h2>Submission Reports</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="reports-modal-search">
                    <input
                        type="text"
                        placeholder="Search by Officer Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="reports-modal-content">
                    {filteredOfficers.length === 0 ? (
                        <div className="no-reports">
                            <p>No reports found.</p>
                        </div>
                    ) : (
                        filteredOfficers.map(officer => (
                            <div key={officer} className="officer-group">
                                <h3 className="officer-header">
                                    <span className="officer-icon">⚓</span>
                                    {officer}
                                    <span className="report-count">({reportsByOfficer[officer].length} reports)</span>
                                </h3>
                                <div className="reports-list">
                                    {reportsByOfficer[officer].map((report, index) => (
                                        <div key={index} className="report-card">
                                            <div className="report-header">
                                                <span className="order-id">Order #{report.orderId}</span>
                                                <span className="report-date">{new Date(report.submittedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="report-details">
                                                <div className="detail-section">
                                                    <h4>⏱️ Time & Particulars</h4>
                                                    <div className="detail-grid">
                                                        <div className="detail-row">
                                                            <span>Duration on Ship:</span>
                                                            <strong>{report.durationOnShip || 'N/A'} mins</strong>
                                                        </div>
                                                        <div className="detail-row">
                                                            <span>Ship Particular?</span>
                                                            <span>{report.shipParticular === 'yes' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <span>Photo %:</span>
                                                            <span>{report.photographyPercentage || 0}%</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="detail-section">
                                                    <h4>📦 Inventory & Competitors</h4>
                                                    <div className="detail-grid">
                                                        <div className="detail-row">
                                                            <span>Items Count:</span>
                                                            <span>{report.numberOfItems || 0}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <span>Jumbo Jets:</span>
                                                            <span>{report.numberOfJumboJets || 0}</span>
                                                        </div>
                                                        {report.returns && (
                                                            <div className="detail-row">
                                                                <span>Returns:</span>
                                                                <span>{report.returns} ({report.returnsCount || 0})</span>
                                                            </div>
                                                        )}
                                                        {report.competitors && (
                                                            <div className="detail-row">
                                                                <span>Competitors:</span>
                                                                <span>{report.competitors}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="detail-section full-width">
                                                    <h4>📝 Status & Notes</h4>
                                                    <div className="detail-grid">
                                                        <div className="detail-row">
                                                            <span>Subject To Check?</span>
                                                            <span className={`status-badge ${report.subjectToCheck === 'yes' ? 'warning' : 'success'}`}>
                                                                {report.subjectToCheck === 'yes' ? 'Yes' : 'No'}
                                                            </span>
                                                        </div>
                                                        {report.notes && (
                                                            <div className="detail-row full-width">
                                                                <span>Notes:</span>
                                                                <p className="notes-text">{report.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .reports-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .reports-modal {
                    background: white;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                .reports-modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .reports-modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: #111827;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                }
                .reports-modal-search {
                    padding: 15px 20px;
                    background: #f9fafb;
                    border-bottom: 1px solid #e5e7eb;
                }
                .search-input {
                    width: 100%;
                    padding: 10px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                .reports-modal-content {
                    padding: 20px;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .officer-group {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .officer-header {
                    background: #f3f4f6;
                    padding: 12px 15px;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.1rem;
                    color: #374151;
                    border-bottom: 1px solid #e5e7eb;
                }
                .officer-icon {
                    font-size: 1.2rem;
                }
                .report-count {
                    font-size: 0.9rem;
                    color: #6b7280;
                    font-weight: normal;
                }
                .reports-list {
                    background: #fff;
                }
                .report-card {
                    padding: 15px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .report-card:last-child {
                    border-bottom: none;
                }
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .order-id {
                    font-weight: bold;
                    color: #2563eb;
                }
                .report-date {
                    color: #6b7280;
                    font-size: 0.9rem;
                }
                .report-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    font-size: 0.95rem;
                }
                .detail-section {
                    background: #f9fafb;
                    padding: 12px;
                    border-radius: 6px;
                }
                .detail-section h4 {
                    margin: 0 0 10px 0;
                    font-size: 0.9rem;
                    color: #4b5563;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 5px;
                }
                .detail-grid {
                    display: grid;
                    gap: 8px;
                }
                .full-width {
                    grid-column: 1 / -1;
                }
                .notes-text {
                    margin: 5px 0 0 0;
                    padding: 8px;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    color: #374151;
                }
                .detail-row {
                    display: flex;
                    flex-direction: column;
                }
                .detail-row span:first-child {
                    font-size: 0.8rem;
                    color: #6b7280;
                    text-transform: uppercase;
                }
                .status-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 9999px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    width: fit-content;
                }
                .status-badge.success {
                    background: #d1fae5;
                    color: #065f46;
                }
                .status-badge.warning {
                    background: #fef3c7;
                    color: #92400e;
                }
                .no-reports {
                    text-align: center;
                    padding: 40px;
                    color: #6b7280;
                    font-style: italic;
                }
            `}</style>
        </div>
    )
}
