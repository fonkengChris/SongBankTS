import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS and security headers with updated CSP
app.use((req, res, next) => {
  res.header(
    "Content-Security-Policy",
    "default-src 'self' https://sheet-music-library-ad225c202768.herokuapp.com; " +
      "img-src 'self' data: https: http: blob: https://sheet-music-library-ad225c202768.herokuapp.com https://storage.googleapis.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.googleusercontent.com https://*.paypal.com https://www.paypalobjects.com; " +
      "style-src 'self' 'unsafe-inline' https://www.paypalobjects.com; " +
      "frame-src 'self' https://accounts.google.com https://*.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com; " +
      "connect-src 'self' https://sheet-music-library-ad225c202768.herokuapp.com https://accounts.google.com https://*.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Parse JSON bodies
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Proxy API requests to your backend
const API_URL =
  process.env.API_URL ||
  "https://sheet-music-library-ad225c202768.herokuapp.com";
// Don't proxy to self - this causes infinite loops
if (API_URL === process.env.HEROKU_APP_NAME) {
  console.error("Cannot proxy to self - please set correct API_URL");
  process.exit(1);
}
app.use(
  "/api",
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/api", // keep /api prefix
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log proxy requests
      console.log("Proxying to:", API_URL + proxyReq.path);
    },
  })
);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle client-side routing - must be after static files
app.get("/*", (req, res) => {
  console.log("Serving index.html for path:", req.path);
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Static files being served from: ${path.join(__dirname, "dist")}`
  );
});
