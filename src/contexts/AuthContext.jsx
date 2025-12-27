import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { validateRegistration, validateLogin, initializeDemoUsers, ROLES } from '../utils/authUtils'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [users, setUsers] = useLocalStorage('golden_ocean_users', [])
    const [currentUser, setCurrentUser] = useLocalStorage('golden_ocean_current_user', null)
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize demo users on first load
    useEffect(() => {
        if (users.length === 0) {
            const demoUsers = initializeDemoUsers()
            setUsers(demoUsers)
            console.log('Demo users initialized:')
            console.log('  Navigation Officer - username: officer, password: officer123')
            console.log('  Admin - username: admin, password: admin123')
        }
        setIsInitialized(true)
    }, [])

    /**
     * Register a new user
     */
    const register = (username, password, role) => {
        const validation = validateRegistration(username, password, role)
        if (!validation.valid) {
            return { success: false, message: validation.message }
        }

        const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase())
        if (existingUser) {
            return { success: false, message: 'Username already exists' }
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            password,
            role,
            createdAt: new Date().toISOString()
        }

        setUsers([...users, newUser])
        return { success: true, message: 'Registration successful', user: newUser }
    }

    /**
     * Log in a user
     */
    const login = (username, password) => {
        const validation = validateLogin(username, password)
        if (!validation.valid) {
            return { success: false, message: validation.message }
        }

        const user = users.find(u =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
        )

        if (!user) {
            return { success: false, message: 'Invalid username or password' }
        }

        setCurrentUser(user)
        return { success: true, message: 'Login successful', user }
    }

    /**
     * Log out the current user
     */
    const logout = () => {
        setCurrentUser(null)
    }

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = () => {
        return currentUser !== null
    }

    /**
     * Get the appropriate page URL for a user role
     */
    const getPageForRole = (role) => {
        switch (role) {
            case ROLES.NAVIGATION_OFFICER:
                return '/navigation-officer'
            case ROLES.ADMIN:
                return '/admin'
            case ROLES.MANAGER:
                return '/manager'
            default:
                return '/'
        }
    }

    const value = {
        currentUser,
        users,
        register,
        login,
        logout,
        isAuthenticated,
        getPageForRole,
        ROLES
    }

    if (!isInitialized) {
        return null // Or a loading spinner
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
