import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
    // Proxy removed for production build (Vercel)
  },
  // No proxy in production; use absolute URLs or environment variables for API endpoints
})