export default function RadioButtonGroup({ name, value, onChange, label, options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] }) {
    return (
        <div>
            <span className="form-label radio-label">
                {label}
            </span>
            <div className="radio-toggle-group">
                {options.map((option) => (
                    <label key={option.value} className="radio-toggle-item">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                            className="radio-toggle-input"
                        />
                        <div className="radio-toggle-button">
                            {option.label}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    )
}
