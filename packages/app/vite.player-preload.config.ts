import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  cacheDir: "node_modules/.vite-player-preload",
  build: {
    sourcemap: true,
    lib: {
      entry: "src/player/preload.ts",
      formats: ["cjs"],
      fileName: () => "player-preload.js",
    },
    rollupOptions: {
      external: ["electron"],
    },
  },
  resolve: {
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
});
