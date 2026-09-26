import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path: "/" by default (Vercel, Netlify, GitHub Pages at a domain root). The NAS deploy at
// https://artificialintelligence.sg/easyinvoice/ sets BASE_PATH=/easyinvoice/ (see scripts/deploy.ps1)
// so every asset URL and the React Router basename get that prefix.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_PATH || '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },

})


