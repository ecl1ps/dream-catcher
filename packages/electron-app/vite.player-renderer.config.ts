import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  cacheDir: resolve(__dirname, "node_modules/.vite-player-renderer"),
  root: resolve(__dirname, "src/player"),
  build: {
    sourcemap: true,
    outDir: resolve(__dirname, ".vite/renderer/player_window"),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
  },
});
