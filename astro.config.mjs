// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  vite: {
    build: {
      // Code splitting per Three.js
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three']
          }
        }
      },
      // Minificazione migliorata
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Rimuovi console.log in produzione
          drop_debugger: true
        }
      }
    },
    // Ottimizzazione dipendenze
    optimizeDeps: {
      include: ['three']
    }
  },
  // Prefetch automatico per navigazione più veloce
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});
