import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'three-vendor',
              test: /[\\/]node_modules[\\/]three[\\/]/,
              priority: 25,
            },
            {
              name: 'motion-vendor',
              test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
              priority: 20,
            },
            {
              name: 'gsap-vendor',
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
              priority: 15,
            },
            {
              name: 'lenis-vendor',
              test: /[\\/]node_modules[\\/]lenis[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
  server: {
    watch: {
      ignored: [
        '**/public/**',
        '**/scripts/**',
        '**/*.zip',
        '**/*.mp4',
        '**/*.webm',
        '**/*.svg',
        '**/*.glb',
        '**/*.gltf',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.webp',
        '**/*.avif',
        '**/node_modules/**',
        '**/.git/**',
      ],
    },
  },
})
