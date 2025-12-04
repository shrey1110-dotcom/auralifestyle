// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const DEV_PORT   = Number(env.VITE_DEV_PORT || 5173);
  const API_TARGET = env.VITE_API_TARGET || 'http://localhost:5000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(r('./'), 'src'), // "@/..." → /src
      },
    },
    server: {
      host: 'localhost',
      port: DEV_PORT,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
      hmr: { protocol: 'ws', host: 'localhost', port: DEV_PORT },
    },
    preview: { port: DEV_PORT },
  };
});
