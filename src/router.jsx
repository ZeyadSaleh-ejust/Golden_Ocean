import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import OrderSelectionPage from './pages/OrderSelectionPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import GPSTrackingPage from './pages/GPSTrackingPage'
import NavigationOfficerPage from './pages/NavigationOfficerPage'
import AdminPage from './pages/AdminPage'
import ProtectedRoute from './components/ProtectedRoute'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />
    },
    {
        path: '/navigation-officer',
        element: <Navigate to="/navigation-officer/tracking" replace />
    },
    {
        path: '/navigation-officer/select-order',
        element: (
            <ProtectedRoute role="navigation-officer">
                <OrderSelectionPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/navigation-officer/order-details',
        element: (
            <ProtectedRoute role="navigation-officer">
                <OrderDetailsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/navigation-officer/tracking',
        element: (
            <ProtectedRoute role="navigation-officer">
                <GPSTrackingPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/navigation-officer/report',
        element: (
            <ProtectedRoute role="navigation-officer">
                <NavigationOfficerPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute role="admin">
                <AdminPage />
            </ProtectedRoute>
        )
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
])
