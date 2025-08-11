import axios from "axios";
import { getValidToken } from "../utils/jwt-validator";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = getValidToken();
    if (token) {
      config.headers["x-auth-token"] = token; // Changed from Authorization: Bearer to x-auth-token
    }
    console.log("Request Config:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    
    // If we get a 401 response, the token is likely expired
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data;
      console.log("Authentication failed:", errorMessage);
      
      if (errorMessage === "Session expired due to inactivity.") {
        console.log("Session expired due to inactivity, logging out user");
      } else {
        console.log("Token expired or invalid, logging out user");
      }
      
      localStorage.removeItem("token");
      
      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
