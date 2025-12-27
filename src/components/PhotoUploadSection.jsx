export default function PhotoUploadSection({ formData, handleInputChange }) {
    return (
        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">📸</span>
                Photos
            </h3>

            <div className="form-row single-column">
                <div className="form-group">
                    <label htmlFor="photos" className="form-label">Photos to be uploaded</label>
                    <input
                        type="file"
                        id="photos"
                        name="photos"
                        className="form-input"
                        accept="image/*"
                        multiple
                        onChange={handleInputChange}
                    />
                    {formData.photos.length > 0 && (
                        <div className="file-list">
                            <p className="file-count">Selected {formData.photos.length} photo(s):</p>
                            <ul>
                                {formData.photos.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
