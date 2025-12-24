import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { OrderProvider } from './contexts/OrderContext'
import { GPSTrackingProvider } from './contexts/GPSTrackingContext'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <OrderProvider>
                <GPSTrackingProvider>
                    <RouterProvider router={router} />
                </GPSTrackingProvider>
            </OrderProvider>
        </AuthProvider>
    </StrictMode>
)
