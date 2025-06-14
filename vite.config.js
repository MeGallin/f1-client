import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console statements in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor dependencies
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['jotai'],
          http: ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size limit
  },
  preview: {
    port: 5173,
    host: true,
  },
});
