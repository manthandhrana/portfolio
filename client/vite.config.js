import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// In development the API runs on :5000 and Vite proxies to it, so the browser sees one origin
// (needed for the admin login cookie). In production Express serves the built files itself.
const API = process.env.VITE_API_PROXY || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': API,
      '/uploads': API,
    },
  },
});
