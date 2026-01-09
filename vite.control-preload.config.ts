import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
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
