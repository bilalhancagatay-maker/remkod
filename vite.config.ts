
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  server: {
    // historyApiFallback is not a valid property in Vite's ServerOptions.
    // Vite handles history API fallback for single-page applications automatically.
  }
});
