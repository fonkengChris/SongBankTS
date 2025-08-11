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
    console.log("JWT validation: No token provided");
    return false;
  }

  try {
    // Try to decode the token
    const decoded = jwtDecode<JWTPayload>(token);
    console.log("JWT validation: Decoded token:", decoded);
    
    // Check if token has required fields
    if (!decoded || !decoded.exp || !decoded._id || !decoded.email) {
      console.log("JWT validation: Missing required fields", {
        hasDecoded: !!decoded,
        hasExp: !!decoded?.exp,
        hasId: !!decoded?._id,
        hasEmail: !!decoded?.email
      });
      return false;
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log("JWT validation: Token expired", {
        tokenExp: decoded.exp,
        currentTime,
        difference: decoded.exp - currentTime
      });
      return false;
    }

    // Check if user has been inactive for more than 15 minutes
    if (decoded.lastActivity) {
      const lastActivity = new Date(decoded.lastActivity);
      const now = new Date();
      const inactiveTime = now.getTime() - lastActivity.getTime();
      const maxInactiveTime = 15 * 60 * 1000; // 15 minutes in milliseconds
      
      if (inactiveTime > maxInactiveTime) {
        console.log("JWT validation: Token expired due to inactivity", {
          lastActivity: decoded.lastActivity,
          inactiveTime: inactiveTime / 1000 / 60, // in minutes
          maxInactiveTime: maxInactiveTime / 1000 / 60 // in minutes
        });
        return false;
      }
    }

    console.log("JWT validation: Token is valid");
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
  console.log("getValidToken: Retrieved token from localStorage:", token ? "exists" : "null");
  
  if (isValidJWT(token)) {
    console.log("getValidToken: Token is valid, returning it");
    return token;
  }
  
  // If token is invalid, remove it from localStorage
  console.log("getValidToken: Token is invalid, removing from localStorage");
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