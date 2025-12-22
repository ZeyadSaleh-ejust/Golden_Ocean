import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { OrderProvider } from './contexts/OrderContext'
import { router } from './router'

function App() {
    return (
        <AuthProvider>
            <OrderProvider>
                <RouterProvider router={router} />
            </OrderProvider>
        </AuthProvider>
    )
}

export default App
