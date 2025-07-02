import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_BACKEND_URL': '"https://proyecto-production-5103.up.railway.app/api"'
  }
})