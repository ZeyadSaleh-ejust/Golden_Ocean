import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
        host: true,  // Allow external access
        strictPort: true,  // Don't try other ports if 5173 is busy
        allowedHosts: [
            '.ngrok-free.dev',  // Allow ngrok free tier URLs
            '.ngrok.io',  // Allow ngrok paid tier URLs
            '.ngrok-free.app',  // Alternative ngrok domain
            'localhost'
        ],
        hmr: {
            clientPort: 443  // Required for HMR to work through ngrok
        }
    }
})
