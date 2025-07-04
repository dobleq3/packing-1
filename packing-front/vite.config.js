import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  server: {
    allowedHosts: [
      "5173-dobleq3-packing1-i8zyk8q7m4v.ws-us120.gitpod.io"
    ]
  }  
})



