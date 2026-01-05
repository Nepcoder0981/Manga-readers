import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://manga-api.techzone.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/image-proxy': {
        target: 'https://mangaimageproxy.techzone.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/image-proxy/, ''),
      },
    },
  },
});