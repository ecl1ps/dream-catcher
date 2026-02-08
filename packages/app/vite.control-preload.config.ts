import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  cacheDir: "node_modules/.vite-control-preload",
  build: {
    sourcemap: true,
    lib: {
      entry: "src/control/preload.ts",
      formats: ["cjs"],
      fileName: () => "control-preload.js",
    },
    rollupOptions: {
      external: ["electron"],
    },
  },
  resolve: {
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
});
