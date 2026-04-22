import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import amadla from '@amadla/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Only show errors (suppresses warnings)

  plugins: [
    // React MUST come first for proper JSX & Fast Refresh
    react(),

    amadla({
      /**
       * Support for legacy code that imports the SDK using:
       *  - @/integrations
       *  - @/entities
       *  - etc.
       *
       * Disable once the app fully migrates to direct `/sdk` imports.
       */
      legacySDKImports:
        process.env.AMADLA_LEGACY_SDK_IMPORTS === 'true',

      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true,
    }),
  ],
})