import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  server: {
    allowedHosts: [
      "5173-dobleq3-packing-j61l7t80bgf.ws-us120.gitpod.io"
    ]
  }  
})



