import { formatDate, formatDateTime } from '../../../utils/authUtils'

export default function ReportSuccessModal({ submittedReport, onClose }) {
    if (!submittedReport) return null

    return (
        <div
            className="modal-overlay active"
            onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}
        >
            <div className="modal">
                <div className="modal-body">
                    <div className="success-modal-content">
                        <div className="success-icon">✓</div>
                        <h2 className="success-title">Report Submitted!</h2>
                        <p className="success-message">
                            Your delivery report has been successfully submitted and saved.
                        </p>

                        <div className="report-summary">
                            <div className="summary-item">
                                <span className="summary-label">Report ID:</span>
                                <span className="summary-value">{submittedReport.id}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Submitted:</span>
                                <span className="summary-value">{formatDateTime(submittedReport.submittedAt)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Vessel Name:</span>
                                <span className="summary-value">{submittedReport.vesselName}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Date of Delivery:</span>
                                <span className="summary-value">{formatDate(submittedReport.dateOfDelivery)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Photos Uploaded:</span>
                                <span className="summary-value">{submittedReport.photoFileNames?.length || 0}</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={onClose}>
                                Submit Another Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
