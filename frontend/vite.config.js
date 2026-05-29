import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    port: 5173,
    proxy: {
      '/auth':         { target: 'http://localhost:9080', changeOrigin: true },
      '/listings':     { target: 'http://localhost:9080', changeOrigin: true },
      '/reservations': { target: 'http://localhost:9080', changeOrigin: true },
      '/payments':     { target: 'http://localhost:9080', changeOrigin: true },
      '/admin':        { target: 'http://localhost:9080', changeOrigin: true },
    },
  },
});
