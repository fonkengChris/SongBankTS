import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS and security headers with updated CSP
app.use((req, res, next) => {
  // Temporarily commenting out CSP to test video loading
  /*
  res.header(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "img-src 'self' data: https: http: blob: https://my-song-library-media.s3.amazonaws.com https://my-song-library-media.s3.eu-west-2.amazonaws.com https://*.s3.amazonaws.com https://*.s3.eu-west-2.amazonaws.com; " +
      "media-src 'self' https: http: blob: https://my-song-library-media.s3.amazonaws.com https://my-song-library-media.s3.eu-west-2.amazonaws.com https://*.s3.amazonaws.com https://*.s3.eu-west-2.amazonaws.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "font-src 'self' data: https://fonts.gstatic.com https://maxcdn.bootstrapcdn.com; " +
      "connect-src 'self' https: http: https://my-song-library-media.s3.amazonaws.com https://my-song-library-media.s3.eu-west-2.amazonaws.com https://*.s3.amazonaws.com https://*.s3.eu-west-2.amazonaws.com;"
  );
  */
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  next();
});

// Proxy API requests to the backend
app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.BACKEND_URL || process.env.VITE_API_URL || "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/api",
    },
  })
);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
