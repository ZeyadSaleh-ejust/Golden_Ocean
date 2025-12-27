export default function AdditionalDetailsSection({ formData, errors, handleInputChange }) {
    return (
        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">📋</span>
                Additional Details
            </h3>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="returns" className="form-label required">Returns</label>
                    <input
                        type="text"
                        id="returns"
                        name="returns"
                        className={`form-input ${errors.returns ? 'error' : ''}`}
                        placeholder="Enter returns information"
                        value={formData.returns}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.returns && <span className="form-error">{errors.returns}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="competitors" className="form-label required">Competitors</label>
                    <input
                        type="text"
                        id="competitors"
                        name="competitors"
                        className={`form-input ${errors.competitors ? 'error' : ''}`}
                        placeholder="List competitor names"
                        value={formData.competitors}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.competitors && <span className="form-error">{errors.competitors}</span>}
                </div>
            </div>

            <div className="form-row single-column">
                <div className="form-group">
                    <label htmlFor="notes" className="form-label required">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        className={`form-textarea ${errors.notes ? 'error' : ''}`}
                        placeholder="Provide any additional notes or observations..."
                        rows="6"
                        value={formData.notes}
                        onChange={handleInputChange}
                        required
                    />
                    <div className="char-counter">
                        {errors.notes && <span className="form-error">{errors.notes}</span>}
                        <span className={formData.notes.length > 1000 ? 'char-limit-exceeded' : 'char-limit-normal'}>
                            {formData.notes.length} / 1000 characters
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
