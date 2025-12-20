// ==========================================
// ORDER TRACKING UTILITIES
// ==========================================

const DUBAI_CENTER = { lat: 25.2048, lng: 55.2708 }
const MAX_DISTANCE = 0.5

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
 * Generate random coordinates near Dubai
 */
export function generateRandomLocation() {
    const lat = DUBAI_CENTER.lat + (Math.random() - 0.5) * MAX_DISTANCE
    const lng = DUBAI_CENTER.lng + (Math.random() - 0.5) * MAX_DISTANCE

    return {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6))
    }
}

/**
 * Simulate location movement
 */
export function simulateMovement(currentLocation) {
    const deltaLat = (Math.random() - 0.5) * 0.002
    const deltaLng = (Math.random() - 0.5) * 0.002

    return {
        lat: parseFloat((currentLocation.lat + deltaLat).toFixed(6)),
        lng: parseFloat((currentLocation.lng + deltaLng).toFixed(6))
    }
}

/**
 * Get random status
 */
export function getRandomStatus() {
    const statuses = ['in-transit', 'in-transit', 'in-transit', 'delivered', 'pending']
    return statuses[Math.floor(Math.random() * statuses.length)]
}

/**
 * Initialize mock orders
 */
export function initializeMockOrders() {
    const orders = []
    const orderCount = 12

    for (let i = 0; i < orderCount; i++) {
        orders.push({
            id: generateOrderId(),
            status: getRandomStatus(),
            currentLocation: generateRandomLocation(),
            destination: generateRandomLocation(),
            lastUpdated: new Date().toISOString(),
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
            estimatedDelivery: new Date(Date.now() + Math.random() * 86400000 * 2).toISOString()
        })
    }

    return orders
}

/**
 * Update order location (simulate movement)
 */
export function updateOrderLocation(orderId) {
    const ordersJson = localStorage.getItem('golden_ocean_orders')
    if (!ordersJson) return null

    const orders = JSON.parse(ordersJson)
    const orderIndex = orders.findIndex(o => o.id === orderId)

    if (orderIndex === -1) return null

    const order = orders[orderIndex]

    if (order.status === 'in-transit') {
        order.currentLocation = simulateMovement(order.currentLocation)
        order.lastUpdated = new Date().toISOString()

        orders[orderIndex] = order
        localStorage.setItem('golden_ocean_orders', JSON.stringify(orders))
    }

    return order
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
 * Calculate distance between two coordinates (rough estimate in km)
 */
export function calculateDistance(coord1, coord2) {
    const R = 6371
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
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'pending': 'Pending'
    }
    return statusMap[status] || status
}
