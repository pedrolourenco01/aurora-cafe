import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        '**/public/**',
        '**/*.glb',
        '**/*.gltf',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.webp',
        '**/node_modules/**',
        '**/.git/**'
      ]
    }
  }
})
