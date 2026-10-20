import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Support Vercel root deployments, GitHub Pages repo deployments, and local relative paths
  base: process.env.VITE_BASE || (process.env.VERCEL ? '/' : (process.env.GITHUB_ACTIONS ? '/pride-muay-thai/' : './')),
  server: {
    port: 5173,
    host: true,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['gsap', 'lenis'],
          three: ['three'],
          mapbox: ['mapbox-gl'],
        },
      },
    },
  },
});
