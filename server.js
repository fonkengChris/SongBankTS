import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS and security headers
app.use((req, res, next) => {
  res.header(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  res.header("Access-Control-Allow-Origin", "*");
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
  "https://sheet-music-library-vite-7ffed1c383be.herokuapp.com";
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
