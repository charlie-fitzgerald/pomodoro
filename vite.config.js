import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      allowedHosts: ["https://e3ea-2001-b011-2019-940f-8d78-6337-7959-9fae.ngrok-free.app "] // ✅ allow ngrok + others
    }
  };
});
