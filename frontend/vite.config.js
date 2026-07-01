import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: "0.0.0.0",
  },

  preview: {
    host: "0.0.0.0",
    allowedHosts: [
      "cooperative-acceptance-production-1b19.up.railway.app",
    ],
  },
});