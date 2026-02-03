import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, "src/control"),
  build: {
    sourcemap: true,
    outDir: resolve(__dirname, ".vite/renderer/control_window"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
