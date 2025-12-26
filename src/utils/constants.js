// ==========================================
// APPLICATION CONSTANTS
// ==========================================

// GPS & Location Tracking
export const GPS_CONFIG = {
    // Interval for admin polling location updates (ms)
    POLLING_INTERVAL: 5000,

    // Maximum age for cached GPS positions (ms)
    MAXIMUM_GPS_AGE: 5000,

    // Timeout for GPS position requests (ms)
    GPS_TIMEOUT: 10000,

    // Threshold for considering a location update "live" (seconds)
    LIVE_LOCATION_THRESHOLD: 30,
}

// Map Configuration
export const MAP_CONFIG = {
    // Dubai center coordinates
    DUBAI_CENTER: { lat: 25.2048, lng: 55.2708 },

    // Default map zoom level
    DEFAULT_ZOOM: 12,

    // Officer detail map zoom level
    OFFICER_MAP_ZOOM: 15,
}

// LocalStorage Keys
export const STORAGE_KEYS = {
    USERS: 'golden_ocean_users',
    CURRENT_USER: 'golden_ocean_current_user',
    ASSIGNED_ORDERS: 'golden_ocean_assigned_orders',
    SELECTED_ORDER: 'golden_ocean_selected_order',
    LOCATION_UPDATES: 'golden_ocean_location_updates',
}

// Data Limits
export const DATA_LIMITS = {
    // Maximum location updates stored per order
    MAX_LOCATIONS_PER_ORDER: 100,
}

// User Roles
export const ROLES = {
    NAVIGATION_OFFICER: 'navigation-officer',
    ADMIN: 'admin',
}
