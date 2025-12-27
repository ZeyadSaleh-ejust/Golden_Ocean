export default function DeliveryInfoSection({ formData, errors, handleInputChange }) {
    return (
        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">📦</span>
                Delivery Information
            </h3>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="dateOfDelivery" className="form-label required">Date of Delivery</label>
                    <input
                        type="date"
                        id="dateOfDelivery"
                        name="dateOfDelivery"
                        className={`form-input ${errors.dateOfDelivery ? 'error' : ''}`}
                        value={formData.dateOfDelivery}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.dateOfDelivery && <span className="form-error">{errors.dateOfDelivery}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="deliveryDate" className="form-label required">Delivery Date</label>
                    <input
                        type="date"
                        id="deliveryDate"
                        name="deliveryDate"
                        className={`form-input ${errors.deliveryDate ? 'error' : ''}`}
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.deliveryDate && <span className="form-error">{errors.deliveryDate}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="expiryDate" className="form-label required">Expiry Date</label>
                    <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.expiryDate && <span className="form-error">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="longevity" className="form-label required">Longevity</label>
                    <input
                        type="date"
                        id="longevity"
                        name="longevity"
                        className={`form-input ${errors.longevity ? 'error' : ''}`}
                        value={formData.longevity}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.longevity && <span className="form-error">{errors.longevity}</span>}
                </div>
            </div>
        </div>
    )
}
