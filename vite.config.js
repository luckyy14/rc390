import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 300, // reasonable warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
            if (id.includes('@react-three')) return 'vendor-r3f';
            return 'vendor';
          }
          if (id.includes('src/pages')) return 'pages';
          if (id.includes('src/ui')) return 'ui';
          if (id.includes('src/modules')) return 'modules';
          return 'main';
        }
      }
    }
  }
})
