import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// ... existing imports ...

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDevelopment = mode === "development";
  const apiUrl = isDevelopment
    ? "http://localhost:3000"
    : "https://sheet-music-library-ad225c202768.herokuapp.com";

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID": JSON.stringify(
        env.VITE_GOOGLE_OAUTH_CLIENT_ID
      ),
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
      },
    },
  };
});
// https://vitejs.dev/config/
