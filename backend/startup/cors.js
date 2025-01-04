const cors = require("cors");

module.exports = function (app) {
  const corsOptions = {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "x-auth-token",
      "Accept",
      "Accept-Encoding",
      "Accept-Language",
      "Connection",
      "Cookie",
      "Host",
      "Origin",
      "Referer",
      "Sec-Fetch-Dest",
      "Sec-Fetch-Mode",
      "Sec-Fetch-Site",
      "User-Agent",
      "sec-ch-ua",
      "sec-ch-ua-mobile",
      "sec-ch-ua-platform",
    ],
    credentials: true,
    optionsSuccessStatus: 200, // Changed to 200 for Chrome
    maxAge: 3600, // Cache preflight for 1 hour
  };

  // Apply CORS middleware
  app.use(cors(corsOptions));

  // Handle OPTIONS preflight requests
  app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,x-auth-token,Accept,Accept-Encoding,Accept-Language,Connection,Cookie,Host,Origin,Referer,Sec-Fetch-Dest,Sec-Fetch-Mode,Sec-Fetch-Site,User-Agent,sec-ch-ua,sec-ch-ua-mobile,sec-ch-ua-platform"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "3600"); // Cache preflight for 1 hour
    res.status(200).end(); // Changed to 200 for Chrome
  });
};
