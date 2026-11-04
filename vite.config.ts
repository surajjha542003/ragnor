import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { findFirstSagaAssets } from './build/firstSagaAssets.ts'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __FIRST_SAGA_IMAGES__: JSON.stringify(
      findFirstSagaAssets(fileURLToPath(new URL('./public', import.meta.url))),
    ),
  },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [react(), tailwindcss()],
})
