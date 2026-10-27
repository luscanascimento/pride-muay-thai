import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
  const supabaseAnonKey =
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    '';

  return {
    plugins: [react()],
    // Support Vercel root deployments, GitHub Pages repo deployments, and local relative paths
    base: process.env.VITE_BASE || (process.env.VERCEL ? '/' : (process.env.GITHUB_ACTIONS ? '/pride-muay-thai/' : './')),
    server: {
      port: 5173,
      host: true,
    },
    define: {
      ...(supabaseUrl ? { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl) } : {}),
      ...(supabaseAnonKey
        ? {
            'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabaseAnonKey),
            'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
          }
        : {}),
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
  };
});
