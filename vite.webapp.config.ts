import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {},
  },
  root: "webapp",
  build: {
    outDir: resolve(__dirname, ".vite/build/webapp"),
    assetsDir: "static",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    port: 3001,
    host: true,
    open: false,
  },
  define: {
    global: "globalThis",
  },
});
