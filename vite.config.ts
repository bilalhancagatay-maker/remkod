
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Vercel ana dizin için her zaman '/' olmalıdır.
  base: '/', 
  define: {
    // Gemini API için process.env.API_KEY erişimini sağlar
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY)
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext'
  }
});
