import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      port: 3000,
      proxy: mode === 'development' ? {
        // Proxy REST API calls to FastAPI backend in development
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          rewrite: (path) => path,
        },
        // Health checks
        '/health': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          rewrite: (path) => path,
        },
        // WebSocket endpoint
        '/ws': {
          target: 'ws://127.0.0.1:8000',
          ws: true,
          changeOrigin: true,
        },
      } : undefined,
    },
    // Base public path when served in production
    base: '/',
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      chunkSizeWarningLimit: 1600,
    },
    // Environment variables to expose to the client
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VITE_API_URL: JSON.stringify(env.VITE_API_URL || '/api'),
      },
    },
  };
});
