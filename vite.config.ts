import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Default to local NestJS backend on http://127.0.0.1:5000 for development (IPv4 avoids Windows ::1 ECONNREFUSED)
  const backendTarget = env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
