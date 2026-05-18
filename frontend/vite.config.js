import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/upload': 'http://backend:8000',
      '/ws': {
        target: 'ws://backend:8000',
        ws: true,
      },
      '/voice': 'http://backend:8000',
      '/health': 'http://backend:8000',
    },
  },
})
