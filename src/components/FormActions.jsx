export default function FormActions({ onReset, isLoading }) {
    return (
        <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onReset}>
                Reset Form
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className="spinner spinner-sm"></span>
                    </>
                ) : (
                    'Submit Report'
                )}
            </button>
        </div>
    )
}
