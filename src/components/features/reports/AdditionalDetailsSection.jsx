export default function AdditionalDetailsSection({ formData, errors, handleInputChange }) {
    // Show returns count field if returns has text
    const showReturnsCount = formData.returns && formData.returns.trim().length > 0

    return (
        <>
            {/* Inventory & Returns Section */}
            <div className="form-section">
                <h3 className="section-title">
                    <span className="section-icon">📦</span>
                    المخزون والمرتجعات
                </h3>

                {/* Number of Items */}
                <div className="form-group">
                    <label htmlFor="numberOfItems" className="form-label">عدد الأصناف</label>
                    <input
                        type="number"
                        id="numberOfItems"
                        name="numberOfItems"
                        className={`form-input ${errors.numberOfItems ? 'error' : ''}`}
                        placeholder="0"
                        min="0"
                        value={formData.numberOfItems}
                        onChange={handleInputChange}
                    />
                    {errors.numberOfItems && <span className="form-error">{errors.numberOfItems}</span>}
                </div>

                {/* Returns */}
                <div className="form-group">
                    <label htmlFor="returns" className="form-label">مرتجع</label>
                    <input
                        type="text"
                        id="returns"
                        name="returns"
                        className={`form-input ${errors.returns ? 'error' : ''}`}
                        placeholder="وصف العناصر المرتجعة..."
                        value={formData.returns}
                        onChange={handleInputChange}
                    />
                    {errors.returns && <span className="form-error">{errors.returns}</span>}

                    {/* Conditional Returns Count */}
                    {showReturnsCount && (
                        <div className="conditional-field-container">
                            <label htmlFor="returnsCount" className="form-label returns-count-label">
                                عداد المرتجع
                            </label>
                            <input
                                type="number"
                                id="returnsCount"
                                name="returnsCount"
                                className={`form-input returns-count-input ${errors.returnsCount ? 'error' : ''}`}
                                placeholder="الكمية"
                                min="0"
                                value={formData.returnsCount}
                                onChange={handleInputChange}
                            />
                            {errors.returnsCount && <span className="form-error">{errors.returnsCount}</span>}
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Data Section */}
            <div className="form-section">
                <h3 className="section-title">
                    <span className="section-icon">📋</span>
                    بيانات إضافية
                </h3>

                {/* Competitors */}
                <div className="form-group">
                    <label htmlFor="competitors" className="form-label">المنافسين</label>
                    <div className="input-with-icon">
                        <input
                            type="text"
                            id="competitors"
                            name="competitors"
                            className={`form-input ${errors.competitors ? 'error' : ''}`}
                            placeholder="أسماء المنافسين..."
                            value={formData.competitors}
                            onChange={handleInputChange}
                        />
                        <div className="input-icon-end">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </div>
                    </div>
                    {errors.competitors && <span className="form-error">{errors.competitors}</span>}
                </div>

                {/* Number of Jumbo Jets */}
                <div className="form-group">
                    <label htmlFor="numberOfJumboJets" className="form-label required">عدد الجامبوهات</label>
                    <input
                        type="number"
                        id="numberOfJumboJets"
                        name="numberOfJumboJets"
                        className={`form-input ${errors.numberOfJumboJets ? 'error' : ''}`}
                        placeholder="0"
                        min="0"
                        value={formData.numberOfJumboJets}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.numberOfJumboJets && <span className="form-error">{errors.numberOfJumboJets}</span>}
                </div>

                {/* Notes */}
                <div className="form-group">
                    <label htmlFor="notes" className="form-label">ملحوظات</label>
                    <textarea
                        id="notes"
                        name="notes"
                        className={`form-textarea ${errors.notes ? 'error' : ''}`}
                        placeholder="ملاحظات إضافية..."
                        rows="4"
                        value={formData.notes}
                        onChange={handleInputChange}
                    />
                    <div className="char-counter">
                        {errors.notes && <span className="form-error">{errors.notes}</span>}
                        <span className={formData.notes.length > 1000 ? 'char-limit-exceeded' : 'char-limit-normal'}>
                            {formData.notes.length} / 1000 characters
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
