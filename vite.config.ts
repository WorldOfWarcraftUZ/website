import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  envDir: "../", // <--- ENG MUHIMI: .env faylni bitta orqa papkadan qidiradi
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});