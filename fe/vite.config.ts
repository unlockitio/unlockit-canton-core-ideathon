import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {}
  },
  server: {
    port: 3000,
    proxy: {
      '/v2': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      '@mojotech/json-type-validation',
      '@daml/types',
      '@daml/ledger',
      '@daml/hub-react'
    ],
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  }
})