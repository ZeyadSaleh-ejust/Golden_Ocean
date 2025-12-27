import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/auth.css'

export default function LoginPage() {
    const navigate = useNavigate()
    const { currentUser, login, register, getPageForRole, ROLES } = useAuth()

    const [isLoginMode, setIsLoginMode] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            const targetPage = getPageForRole(currentUser.role)
            navigate(targetPage, { replace: true })
        }
    }, [currentUser, navigate, getPageForRole])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        // Simulate network delay
        setTimeout(() => {
            if (isLoginMode) {
                const result = login(formData.username, formData.password)
                setIsLoading(false)

                if (result.success) {
                    setSuccess(result.message + ' Redirecting...')
                    setTimeout(() => {
                        const targetPage = getPageForRole(result.user.role)
                        navigate(targetPage, { replace: true })
                    }, 1000)
                } else {
                    setError(result.message)
                }
            } else {
                const result = register(formData.username, formData.password, formData.role)
                setIsLoading(false)

                if (result.success) {
                    setSuccess(result.message + ' You can now sign in.')
                    setFormData({ username: formData.username, password: '', role: '' })
                    setTimeout(() => {
                        setIsLoginMode(true)
                        setSuccess('')
                    }, 1500)
                } else {
                    setError(result.message)
                }
            }
        }, 500)
    }

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode)
        setError('')
        setSuccess('')
        setFormData({ username: '', password: '', role: '' })
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <img src="/logo.png" alt="Golden Ocean Marine Services" className="auth-logo-img" />
                        <p className="auth-subtitle">
                            {isLoginMode ? 'Sign in to your account' : 'Create a new account'}
                        </p>
                    </div>

                    {error && <div className="auth-error show">{error}</div>}
                    {success && <div className="auth-success show">{success}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label required">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-input"
                                placeholder={isLoginMode ? 'Enter your username' : 'Choose a username'}
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label required">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder={isLoginMode ? 'Enter your password' : 'Choose a password (min 6 characters)'}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                            />
                        </div>

                        {!isLoginMode && (
                            <div className="form-group">
                                <label className="form-label required">Select Your Role</label>
                                <div className="role-selector">
                                    <div className="role-option">
                                        <input
                                            type="radio"
                                            id="roleNavigation"
                                            name="role"
                                            value={ROLES.NAVIGATION_OFFICER}
                                            className="role-input"
                                            checked={formData.role === ROLES.NAVIGATION_OFFICER}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor="roleNavigation" className="role-label">
                                            <div className="role-icon">⚓</div>
                                            <div className="role-name">Navigation Officer</div>
                                            <div className="role-description">Submit reports</div>
                                        </label>
                                    </div>

                                    <div className="role-option">
                                        <input
                                            type="radio"
                                            id="roleAdmin"
                                            name="role"
                                            value={ROLES.ADMIN}
                                            className="role-input"
                                            checked={formData.role === ROLES.ADMIN}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor="roleAdmin" className="role-label">
                                            <div className="role-icon">👨‍💼</div>
                                            <div className="role-name">Admin</div>
                                            <div className="role-description">Track orders</div>
                                        </label>
                                    </div>

                                    <div className="role-option">
                                        <input
                                            type="radio"
                                            id="roleManager"
                                            name="role"
                                            value={ROLES.MANAGER}
                                            className="role-input"
                                            checked={formData.role === ROLES.MANAGER}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor="roleManager" className="role-label">
                                            <div className="role-icon">📋</div>
                                            <div className="role-name">Manager</div>
                                            <div className="role-description">Create orders</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner spinner-sm"></span>
                                </>
                            ) : (
                                isLoginMode ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        <p className="auth-toggle-text">
                            {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
                            {' '}
                            <a className="auth-toggle-link" onClick={toggleMode}>
                                {isLoginMode ? 'Sign up' : 'Sign in'}
                            </a>
                        </p>
                    </div>

                    <div className="alert alert-info mt-lg" style={{ fontSize: 'var(--font-size-xs)' }}>
                        <strong>Demo Accounts:</strong><br />
                        Officer: <code style={{ color: 'var(--info)' }}>officer / officer123</code><br />
                        Admin: <code style={{ color: 'var(--info)' }}>admin / admin123</code><br />
                        Manager: <code style={{ color: 'var(--info)' }}>manager / manager123</code>
                    </div>
                </div>
            </div>
        </div>
    )
}
