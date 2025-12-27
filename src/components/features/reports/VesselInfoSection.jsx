import RadioButtonGroup from './RadioButtonGroup'

export default function VesselInfoSection({ formData, errors, handleInputChange }) {
    return (
        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">⏱️</span>
                الوقت والمراجعات
            </h3>

            {/* Duration on Ship */}
            <div className="form-group">
                <label htmlFor="durationOnShip" className="form-label required">
                    مدة البقاء على المركب (دقيقة)
                </label>
                <div className="input-with-icon">
                    <input
                        type="number"
                        id="durationOnShip"
                        name="durationOnShip"
                        className={`form-input ${errors.durationOnShip ? 'error' : ''}`}
                        placeholder="مثال: 45"
                        min="0"
                        value={formData.durationOnShip}
                        onChange={handleInputChange}
                        required
                    />
                    <div className="input-icon-end">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                </div>
                {errors.durationOnShip && <span className="form-error">{errors.durationOnShip}</span>}
            </div>

            {/* Subject to Check */}
            <div className="form-group">
                <RadioButtonGroup
                    name="subjectToCheck"
                    value={formData.subjectToCheck}
                    onChange={handleInputChange}
                    label="Subject to check?"
                    options={[
                        { value: 'yes', label: 'نعم' },
                        { value: 'no', label: 'لا' }
                    ]}
                />
            </div>

            {/* Ship Particular */}
            <div className="form-group">
                <RadioButtonGroup
                    name="shipParticular"
                    value={formData.shipParticular}
                    onChange={handleInputChange}
                    label="Ship particular?"
                    options={[
                        { value: 'yes', label: 'نعم' },
                        { value: 'no', label: 'لا' }
                    ]}
                />
            </div>
        </div>
    )
}
