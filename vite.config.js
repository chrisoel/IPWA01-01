// REQ: QA-08 Browserkompatibler Standard-Build via Vite; QA-09 performanter Build mit Optimierungen; QA-10 modulare Build- und Testkonfiguration
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
