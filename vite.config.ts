import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Static SPA — builds to /dist, hostable on any static host
// (GitHub Pages / Netlify / Vercel). No SSR required.
export default defineConfig({
  base: "./",
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
        },
      },
    },
  },
});
