import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, role }) {
    const { currentUser, getPageForRole } = useAuth()

    // Not authenticated - redirect to login
    if (!currentUser) {
        return <Navigate to="/" replace />
    }

    // Wrong role - redirect to their correct page
    if (currentUser.role !== role) {
        const correctPage = getPageForRole(currentUser.role)
        return <Navigate to={correctPage} replace />
    }

    return children
}
