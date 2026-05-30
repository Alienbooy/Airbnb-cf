import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración limpia para BUILD solamente.
// No necesitamos proxy ni server config — Docker compila y sirve en producción.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
});
