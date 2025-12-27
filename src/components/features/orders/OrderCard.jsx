import { TrashIcon, UserIcon, ChevronDownIcon, MapPinIcon, ShipIcon, CalendarIcon, ClockIcon } from '../../common/Icons'

export default function OrderCard({ order, index, isRemovable, onRemove, onChange, officers }) {
    return (
        <div className="order-card">
            {/* Card Header */}
            <div className="card-header">
                <div className="order-number-badge">
                    <span className="badge-num">{index + 1}</span>
                    <span className="badge-text">Order #{index + 1}</span>
                </div>
                {isRemovable && (
                    <button
                        className="delete-btn"
                        onClick={() => onRemove(index)}
                        aria-label="Delete order"
                    >
                        <TrashIcon />
                    </button>
                )}
            </div>

            {/* Card Body - Form Fields */}
            <div className="card-body">
                {/* Navigator Dropdown */}
                <div className="form-field">
                    <label>Navigator</label>
                    <div className="input-wrapper">
                        <UserIcon />
                        <select
                            value={order.navigator}
                            onChange={(e) => onChange(index, 'navigator', e.target.value)}
                        >
                            <option value="">Select Navigator</option>
                            {officers.map(officer => (
                                <option key={officer.id} value={officer.username}>
                                    Capt. {officer.username.charAt(0).toUpperCase() + officer.username.slice(1)}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon />
                    </div>
                </div>

                {/* Pickup Location */}
                <div className="form-field">
                    <label>Pick Up Location</label>
                    <div className="input-wrapper">
                        <MapPinIcon />
                        <input
                            type="text"
                            placeholder="Enter location name"
                            value={order.pickupLocation}
                            onChange={(e) => onChange(index, 'pickupLocation', e.target.value)}
                        />
                    </div>
                </div>

                {/* Order No & Ship Name Row */}
                <div className="form-row">
                    <div className="form-field">
                        <label>Order No.</label>
                        <input
                            type="text"
                            placeholder="ORD-000"
                            value={order.orderNo}
                            onChange={(e) => onChange(index, 'orderNo', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Ship Name</label>
                        <div className="input-wrapper">
                            <ShipIcon />
                            <input
                                type="text"
                                placeholder="Ship Name"
                                value={order.shipName}
                                onChange={(e) => onChange(index, 'shipName', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ETA Date & Time Row */}
                <div className="form-row">
                    <div className="form-field">
                        <label>ETA Date</label>
                        <div className="input-wrapper">
                            <CalendarIcon />
                            <input
                                type="date"
                                value={order.etaDate}
                                onChange={(e) => onChange(index, 'etaDate', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-field">
                        <label>ETA Time</label>
                        <div className="input-wrapper">
                            <ClockIcon />
                            <input
                                type="time"
                                value={order.etaTime}
                                onChange={(e) => onChange(index, 'etaTime', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
