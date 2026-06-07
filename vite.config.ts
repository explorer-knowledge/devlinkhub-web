import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    host: true,
    allowedHosts: true
  },
  build: {
    // Warn at 400KB
    chunkSizeWarningLimit: 400,
    // Minify CSS
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunk splitting: vendor libs cached separately from app code
        manualChunks(id) {
          // React core — rarely changes, cached long-term
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // React Router — stable, separate chunk
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          // Framer Motion — large (~150KB), separate chunk
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          // Lenis smooth scroll
          if (id.includes('node_modules/lenis')) {
            return 'lenis';
          }
        }
      }
    }
  }
})