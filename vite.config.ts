import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID": JSON.stringify(
      process.env.VITE_GOOGLE_OAUTH_CLIENT_ID
    ),
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://sheet-music-library-ad225c202768.herokuapp.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
