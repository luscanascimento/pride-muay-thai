import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Support both GitHub Pages project repository deployment and root/custom domain deployment
  base: process.env.VITE_BASE || (process.env.GITHUB_ACTIONS ? '/pride-muay-thai/' : './'),
  server: {
    port: 5173,
    host: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['gsap', 'lenis'],
          three: ['three'],
        },
      },
    },
  },
});
