import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Proxies /api requests to the Spring Boot backend during local dev,
// so the frontend can just call relative paths like "/api/auctions"
// without hardcoding a host, and without hitting CORS in dev mode.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
