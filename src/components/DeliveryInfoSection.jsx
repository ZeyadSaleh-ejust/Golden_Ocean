export default function DeliveryInfoSection({ formData, errors, handleInputChange }) {
    return (
        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">📄</span>
                الوثائق
            </h3>

            {/* Photography Percentage */}
            <div className="form-group">
                <label htmlFor="photographyPercentage" className="form-label">
                    نسبة التصوير (%)
                </label>
                <div className="input-with-icon">
                    <input
                        type="number"
                        id="photographyPercentage"
                        name="photographyPercentage"
                        className={`form-input ${errors.photographyPercentage ? 'error' : ''}`}
                        placeholder="0-100"
                        min="0"
                        max="100"
                        value={formData.photographyPercentage}
                        onChange={handleInputChange}
                    />
                    <div className="input-icon-end percentage-icon">
                        %
                    </div>
                </div>
                {errors.photographyPercentage && <span className="form-error">{errors.photographyPercentage}</span>}
            </div>

            {/* Photos Section */}
            <div className="form-group">
                <div className="photos-header">
                    <span className="form-label photos-label">الصور</span>
                    {formData.photos.length > 0 && (
                        <span className="photo-count-badge">
                            {formData.photos.length} {formData.photos.length === 1 ? 'صورة' : 'صور'}
                        </span>
                    )}
                </div>

                <div className="photos-grid">
                    {/* Display existing photos */}
                    {formData.photos.slice(0, 3).map((file, index) => (
                        <div key={index} className="photo-grid-item">
                            <div className="photo-placeholder">
                                <span className="photo-filename">{file.name.slice(0, 8)}...</span>
                            </div>
                        </div>
                    ))}

                    {/* Add photo button */}
                    <label className="photo-grid-add-button">
                        <input
                            type="file"
                            name="photos"
                            accept="image/*"
                            multiple
                            onChange={handleInputChange}
                            style={{ display: 'none' }}
                        />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span className="add-photo-plus">+</span>
                    </label>
                </div>
            </div>
        </div>
    )
}
