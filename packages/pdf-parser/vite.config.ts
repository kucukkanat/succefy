import { defineConfig } from "vite";
export default defineConfig({
  plugins: [],
  build: {
    outDir: "dist",
    lib: {
      entry: "component.ts",
      name: "component",
      formats: ["es"],
      // fileName: (format) => `succefy-cv-button.${format}.js`,
    },
  },
  server: {
    host: "0.0.0.0",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
