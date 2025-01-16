import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

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
          target: "https://sheet-music-library-ad225c202768.herokuapp.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
