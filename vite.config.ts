import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Custom public directory
  server: {
    port: 3000,
    open: true,
    https: {
      key: fs.readFileSync('./certs/localhost+2-key.pem'),
      cert: fs.readFileSync('./certs/localhost+2.pem')
    }
  }
})
