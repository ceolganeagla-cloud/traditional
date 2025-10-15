import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If this repo is your special Pages repo "ceolganeagla-cloud.github.io":
//   base: '/'
// If it's a normal project repo, e.g. "traditional":
//   base: '/traditional/'
export default defineConfig({
  base: '/',          // change to '/<repo>/' if it’s a project Pages site
  plugins: [react()],
  optimizeDeps: { exclude: ['lucide-react'] },
})
