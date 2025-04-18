import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { proxyConfig } from './proxy.config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  base: "./",
  server: {
    proxy: proxyConfig
  },
  build: {
    outDir: 'dist',
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
    sourcemap: true
  },
})
