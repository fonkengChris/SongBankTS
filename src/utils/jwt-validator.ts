import jwtDecode from "jwt-decode";

interface JWTPayload {
  exp: number;
  iat: number;
  _id: string;
  name: string;
  email: string;
  role: "regular" | "admin" | "superAdmin";
  token_type: string;
  lastActivity: string;
}

/**
 * Validates if a JWT token is valid and not expired
 * @param token - The JWT token to validate
 * @returns true if token is valid and not expired, false otherwise
 */
export const isValidJWT = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    // Try to decode the token
    const decoded = jwtDecode<JWTPayload>(token);
    
    // Check if token has required fields
    if (!decoded || !decoded.exp || !decoded._id || !decoded.email) {
      return false;
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return false;
    }

    // Check if user has been inactive for more than 15 minutes
    if (decoded.lastActivity) {
      const lastActivity = new Date(decoded.lastActivity);
      const now = new Date();
      const inactiveTime = now.getTime() - lastActivity.getTime();
      const maxInactiveTime = 15 * 60 * 1000; // 15 minutes in milliseconds
      
      if (inactiveTime > maxInactiveTime) {
        console.log("Token expired due to inactivity");
        return false;
      }
    }

    return true;
  } catch (error) {
    // If decoding fails, token is invalid
    console.error("JWT validation error:", error);
    return false;
  }
};

/**
 * Gets a valid JWT token from localStorage
 * @returns The token if valid, null otherwise
 */
export const getValidToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (isValidJWT(token)) {
    return token;
  }
  
  // If token is invalid, remove it from localStorage
  localStorage.removeItem("token");
  return null;
};

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export const decodeToken = (token: string | null): JWTPayload | null => {
  if (!isValidJWT(token)) {
    return null;
  }

  try {
    return jwtDecode<JWTPayload>(token!);
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}; 