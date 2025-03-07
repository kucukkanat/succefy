import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  root: "src",
  base: "./",
  plugins: [tailwindcss()],
  build: {
    outDir: "dist",
    // lib: {
    //   entry: "src/succefy-cv-button.ts",
    //   name: "succefy-cv-button",
    //   formats: ["es"],
    //   // fileName: (format) => `succefy-cv-button.${format}.js`,
    // },
  },
  server: {
    host: "0.0.0.0",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
