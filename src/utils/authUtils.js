// ==========================================
// AUTHENTICATION UTILITIES
// ==========================================

const ROLES = {
    NAVIGATION_OFFICER: 'navigation-officer',
    ADMIN: 'admin',
    MANAGER: 'manager'
}

/**
 * Validate registration data
 */
export function validateRegistration(username, password, role) {
    if (!username || !password || !role) {
        return { valid: false, message: 'All fields are required' }
    }

    if (username.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' }
    }

    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' }
    }

    if (!Object.values(ROLES).includes(role)) {
        return { valid: false, message: 'Invalid role selected' }
    }

    return { valid: true }
}

/**
 * Validate login credentials
 */
export function validateLogin(username, password) {
    if (!username || !password) {
        return { valid: false, message: 'Username and password are required' }
    }

    return { valid: true }
}

/**
 * Initialize demo users
 */
export function initializeDemoUsers() {
    return [
        {
            id: 'demo-nav-1',
            username: 'officer',
            password: 'officer123',
            role: ROLES.NAVIGATION_OFFICER,
            createdAt: new Date().toISOString()
        },
        {
            id: 'demo-admin-1',
            username: 'admin',
            password: 'admin123',
            role: ROLES.ADMIN,
            createdAt: new Date().toISOString()
        },
        {
            id: 'demo-manager-1',
            username: 'manager',
            password: 'manager123',
            role: ROLES.MANAGER,
            createdAt: new Date().toISOString()
        }
    ]
}

/**
 * Format date for display
 */
export function formatDate(isoDate) {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Format datetime for display
 */
export function formatDateTime(isoDatetime) {
    const date = new Date(isoDatetime)
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

export { ROLES }
