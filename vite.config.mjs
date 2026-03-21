import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a different base in development so localhost serves at '/'.
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  return {
    base: process.env.VITE_BASE || (isProd ? '/diary/' : '/'),
    plugins: [react()],
    // In development, bind to all interfaces so localhost resolves on IPv4 and IPv6
    server: isProd ? undefined : { host: true },
    assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg']
  }
})
