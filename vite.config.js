import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Only show errors (suppresses warnings)

  plugins: [
    // React MUST come first for proper JSX & Fast Refresh
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  root: __dirname,
})