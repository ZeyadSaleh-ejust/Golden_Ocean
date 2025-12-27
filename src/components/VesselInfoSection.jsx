export default function VesselInfoSection({ formData, errors, handleInputChange }) {
    return (
        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">🚢</span>
                Vessel Information
            </h3>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="vesselName" className="form-label required">Vessel Name</label>
                    <input
                        type="text"
                        id="vesselName"
                        name="vesselName"
                        className={`form-input ${errors.vesselName ? 'error' : ''}`}
                        placeholder="Enter vessel name"
                        value={formData.vesselName}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.vesselName && <span className="form-error">{errors.vesselName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="numberOfJumboJets" className="form-label required">Number of Jumbo Jets</label>
                    <input
                        type="number"
                        id="numberOfJumboJets"
                        name="numberOfJumboJets"
                        className={`form-input ${errors.numberOfJumboJets ? 'error' : ''}`}
                        placeholder="Enter number"
                        min="0"
                        value={formData.numberOfJumboJets}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.numberOfJumboJets && <span className="form-error">{errors.numberOfJumboJets}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label checkbox-label">
                        <input
                            type="checkbox"
                            name="vesselSubjectToInspection"
                            checked={formData.vesselSubjectToInspection}
                            onChange={handleInputChange}
                            className="form-checkbox"
                        />
                        <span>Vessel subject to inspection</span>
                    </label>
                </div>
            </div>
        </div>
    )
}
