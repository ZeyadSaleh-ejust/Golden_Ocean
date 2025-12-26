// ==========================================
// ORDER TRACKING UTILITIES (Real GPS Version)
// ==========================================

const DUBAI_CENTER = { lat: 25.2048, lng: 55.2708 }

/**
 * Generate random order ID
 */
export function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = 'ORD-'
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}

/**
 * Get random status
 */
export function getRandomStatus() {
    const statuses = ['pending', 'assigned', 'in-transit', 'delivered']
    return statuses[Math.floor(Math.random() * statuses.length)]
}

/**
 * Initialize mock orders (assigned to Navigation Officers)
 */
export function initializeMockOrders() {
    const orders = []
    const orderCount = 8

    const destinations = [
        { name: 'Dubai Marina', lat: 25.0772, lng: 55.1364 },
        { name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
        { name: 'Jumeirah Beach', lat: 25.1367, lng: 55.1852 },
        { name: 'Dubai Mall', lat: 25.1975, lng: 55.2796 },
        { name: 'Business Bay', lat: 25.1883, lng: 55.2651 },
        { name: 'Palm Jumeirah', lat: 25.1124, lng: 55.1390 },
        { name: 'Dubai Creek', lat: 25.2588, lng: 55.3279 },
        { name: 'Al Barsha', lat: 25.1071, lng: 55.2016 }
    ]

    for (let i = 0; i < orderCount; i++) {
        const destination = destinations[i % destinations.length]
        orders.push({
            id: generateOrderId(),
            status: i < 3 ? 'assigned' : getRandomStatus(), // First 3 are assigned
            destination: {
                name: destination.name,
                lat: destination.lat,
                lng: destination.lng
            },
            assignedTo: null, // Will be assigned when officer selects
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
            estimatedDelivery: new Date(Date.now() + Math.random() * 86400000 * 2).toISOString(),
            customerName: `Customer ${i + 1}`,
            deliveryAddress: destination.name
        })
    }

    return orders
}

/**
 * Assign order to an officer
 */
export function assignOrderToOfficer(orderId, officerId) {
    const ordersJson = localStorage.getItem('golden_ocean_assigned_orders')
    if (!ordersJson) return null

    const orders = JSON.parse(ordersJson)
    const orderIndex = orders.findIndex(o => o.id === orderId)

    if (orderIndex === -1) return null

    orders[orderIndex].assignedTo = officerId
    orders[orderIndex].status = 'in-transit'
    orders[orderIndex].assignedAt = new Date().toISOString()

    localStorage.setItem('golden_ocean_assigned_orders', JSON.stringify(orders))
    return orders[orderIndex]
}

/**
 * Create and store a location update
 */
export function createLocationUpdate(orderId, userId, location) {
    const locationUpdate = {
        id: `LOC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        orderId,
        userId,
        location: {
            lat: location.lat,
            lng: location.lng
        },
        accuracy: location.accuracy || null,
        timestamp: new Date().toISOString()
    }

    // Get existing updates
    const updatesJson = localStorage.getItem('golden_ocean_location_updates')
    const updates = updatesJson ? JSON.parse(updatesJson) : []

    // Add new update
    updates.push(locationUpdate)

    // Keep only last 100 updates per order to prevent storage overflow
    const orderUpdates = updates.filter(u => u.orderId === orderId)
    if (orderUpdates.length > 100) {
        // Remove oldest updates
        const toRemove = orderUpdates.slice(0, orderUpdates.length - 100)
        const toRemoveIds = new Set(toRemove.map(u => u.id))
        const filteredUpdates = updates.filter(u => !toRemoveIds.has(u.id))
        localStorage.setItem('golden_ocean_location_updates', JSON.stringify(filteredUpdates))
    } else {
        localStorage.setItem('golden_ocean_location_updates', JSON.stringify(updates))
    }

    return locationUpdate
}

/**
 * Get location history for a specific order
 */
export function getLocationHistory(orderId) {
    const updatesJson = localStorage.getItem('golden_ocean_location_updates')
    if (!updatesJson) return []

    const updates = JSON.parse(updatesJson)
    return updates
        .filter(u => u.orderId === orderId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

/**
 * Get latest location for each active order
 */
export function getLatestLocations() {
    const updatesJson = localStorage.getItem('golden_ocean_location_updates')
    const ordersJson = localStorage.getItem('golden_ocean_assigned_orders')

    if (!updatesJson || !ordersJson) return []

    const updates = JSON.parse(updatesJson)
    const orders = JSON.parse(ordersJson)

    // Group updates by order ID and get the latest for each
    const latestByOrder = {}
    updates.forEach(update => {
        if (!latestByOrder[update.orderId] ||
            new Date(update.timestamp) > new Date(latestByOrder[update.orderId].timestamp)) {
            latestByOrder[update.orderId] = update
        }
    })

    // Combine with order information and normalize data structure
    return Object.values(latestByOrder).map(update => {
        const order = orders.find(o => o.id === update.orderId)

        // Normalize location structure - handle both legacy and new formats
        // Legacy: { lat, lng, ... } at top level
        // New: { location: { lat, lng }, ... }
        let location = update.location
        if (!location && (update.lat !== undefined && update.lng !== undefined)) {
            // Legacy format - create nested location object
            location = { lat: update.lat, lng: update.lng }
        }

        return {
            ...update,
            location,  // Normalized location object
            order: order || null
        }
    }).filter(item => item.order !== null)
}

/**
 * Get current location for a specific order (latest update)
 */
export function getCurrentLocation(orderId) {
    const history = getLocationHistory(orderId)
    return history.length > 0 ? history[history.length - 1] : null
}

/**
 * Format coordinates for display
 */
export function formatCoordinate(value, type) {
    const direction = type === 'lat'
        ? (value >= 0 ? 'N' : 'S')
        : (value >= 0 ? 'E' : 'W')

    return `${Math.abs(value).toFixed(6)}° ${direction}`
}

/**
 * Calculate distance between two coordinates (Haversine formula in km)
 */
export function calculateDistance(coord1, coord2) {
    const R = 6371 // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return parseFloat((R * c).toFixed(2))
}

/**
 * Get status display name
 */
export function getStatusDisplay(status) {
    const statusMap = {
        'pending': 'Pending',
        'assigned': 'Assigned',
        'in-transit': 'In Transit',
        'delivered': 'Delivered'
    }
    return statusMap[status] || status
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
    const colorMap = {
        'pending': 'warning',
        'assigned': 'info',
        'in-transit': 'primary',
        'delivered': 'success'
    }
    return colorMap[status] || 'secondary'
}
