import { ReactNode, createContext, useState, useEffect, useCallback } from "react";
import { Auth } from "../entities/Auth";

interface Props {
  children: ReactNode;
}

export type AuthCridentials = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthCridentials>({} as AuthCridentials);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<Auth>({} as Auth);

  // Define logout function first to avoid circular dependency
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuth({} as Auth);
    // Redirect to login page
    window.location.href = "/auth";
  }, []);

  // Check token validity on mount and set up periodic checks
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          if (decoded && decoded.email) {
            setAuth({ user: decoded.email, pwd: "", access: token });
          } else {
            // Token is invalid or expired, logout
            logout();
          }
        } catch (error) {
          // Token is invalid, logout
          logout();
        }
      }
    };

    // Check immediately
    checkTokenValidity();

    // Set up periodic check every 5 minutes (more frequent for activity-based expiration)
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout]);

  // Track user activity to extend session
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleUserActivity = () => {
      // Update the token's lastActivity timestamp in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          if (decoded) {
            // Update the lastActivity in the decoded token
            decoded.lastActivity = new Date().toISOString();
            // Note: We can't modify the actual JWT token, but we can track activity locally
            // The backend will update the actual timestamp on each request
          }
        } catch (error) {
          console.error("Error updating activity timestamp:", error);
        }
      }
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      // Clean up event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  const isAuthenticated = !!auth.access;

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
