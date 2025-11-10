import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@daml': path.resolve(__dirname, './codegen')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/v1': {
        target: 'http://localhost:7575',
        changeOrigin: true
      }
    }
  }
})
