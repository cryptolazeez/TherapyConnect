import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

// Vite configuration
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode
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
      proxy:
        mode === 'development'
          ? {
              // Proxy API requests to FastAPI backend in dev
              '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
              },
              '/health': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
              },
              '/ws': {
                target: 'ws://127.0.0.1:8000',
                ws: true,
                changeOrigin: true,
              },
            }
          : undefined,
    },
    // Use relative paths in production so it works on any static host
    base: './',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      chunkSizeWarningLimit: 1600,
    },
    // Expose env variables to the client
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __API_URL__: JSON.stringify(env.VITE_API_URL || '/api'),
    },
  };
});
