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
  res.header(
    "Content-Security-Policy",
    "default-src 'self' https://sheet-music-library-ad225c202768.herokuapp.com; " +
      "img-src 'self' data: https: http: blob: https://sheet-music-library-ad225c202768.herokuapp.com https://storage.googleapis.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.googleusercontent.com https://*.paypal.com https://www.paypalobjects.com https://www.youtube.com https://s.ytimg.com; " +
      "style-src 'self' 'unsafe-inline' https://www.paypalobjects.com; " +
      "frame-src 'self' https://accounts.google.com https://*.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com https://www.youtube.com https://www.youtube-nocookie.com; " +
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

// Add logging for debugging
console.log("Node ENV:", process.env.NODE_ENV);
console.log("API URL:", process.env.API_URL);
console.log("Heroku App Name:", process.env.HEROKU_APP_NAME);

// Determine API URL based on environment
const API_URL =
  process.env.API_URL ||
  "https://sheet-music-library-ad225c202768.herokuapp.com";

// Better self-proxy check
if (
  process.env.HEROKU_APP_NAME &&
  API_URL.includes(process.env.HEROKU_APP_NAME)
) {
  console.error(
    "Error: API_URL matches HEROKU_APP_NAME. This would cause an infinite proxy loop."
  );
  console.error("API_URL:", API_URL);
  console.error("HEROKU_APP_NAME:", process.env.HEROKU_APP_NAME);
  process.exit(1);
}

// Add error handling for proxy
app.use(
  "/api",
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/api",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log("Proxying request to:", API_URL + proxyReq.path);
    },
    onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      res.status(500).send("Proxy Error");
    },
    // Skip proxy for media_files endpoint - we'll handle it locally
    filter: (pathname, req) => {
      if (pathname.startsWith("/api/media_files/")) {
        return false; // Don't proxy this request
      }
      return true; // Proxy all other requests
    },
  })
);

// Local media files endpoint
app.get("/api/media_files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers["x-auth-token"];

    // Fetch media file data from Heroku backend
    const response = await fetch(`${API_URL}/api/media_files/${id}`, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "Media file not found" });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const mediaFile = await response.json();
    res.json(mediaFile);
  } catch (error) {
    console.error("Error fetching media file:", error);
    res.status(500).json({ error: "Failed to fetch media file" });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle client-side routing - must be after static files
app.get("/*", (req, res) => {
  console.log("Serving index.html for path:", req.path);
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Improve error handling
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  console.error("Stack:", err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: ${API_URL}`);
  console.log(
    `Static files being served from: ${path.join(__dirname, "dist")}`
  );
});
