import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.removeHeader("origin");
            proxyReq.setHeader("origin", "http://127.0.0.1:5173");
          });
        },
      },
    },
  },
});
