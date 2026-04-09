import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // ব্যাকএন্ড প্রক্সি - /api রিকোয়েস্ট সরাসরি ব্যাকএন্ডে যাবে
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
