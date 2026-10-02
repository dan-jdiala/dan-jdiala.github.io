import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Served from the root of https://dan-jdiala.github.io (a GitHub Pages user site).
export default defineConfig({
  base: '/',
  plugins: [react()],
})
