import { ReactNode, createContext, useState, useEffect, useCallback } from "react";
import { Auth } from "../entities/Auth";
import { getValidToken, decodeToken } from "../utils/jwt-validator";

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

  // Check token validity on mount and set up periodic checks
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          setAuth({ user: decoded.email, pwd: "", access: token });
        } else {
          // Token is invalid or expired, logout
          logout();
        }
      }
    };

    // Check immediately
    checkTokenValidity();

    // Set up periodic check every minute
    const interval = setInterval(checkTokenValidity, 60000);

    return () => clearInterval(interval);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuth({} as Auth);
    // Redirect to login page
    window.location.href = "/login";
  }, []);

  const isAuthenticated = !!auth.access && !!getValidToken();

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
