import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/axios-config";
import Cookies from "js-cookie";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import APIClient from "../services/api-client";
import { AuthResponse, AuthCredentials } from "../types/forms";
import "../styles/auth.css";
// import backgroundImage from "../assets/background_image.jpg";

const Login = () => {
  const jwt = localStorage.getItem("token");
  if (jwt) return <Navigate to="/songs" />;

  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const authApi = new APIClient<AuthResponse, AuthCredentials>("/api/auth");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Attempting login...");
      const response = await authApi.post({ email: user, password: pwd });
      // console.log("Login successful:", response);

      const access = response?.accessToken;
      localStorage.setItem("token", access);

      setAuth({ user, pwd, access });
      console.log(auth);
      setUser("");
      setPwd("");

      navigate("/");
      navigate(0);
    } catch (err: any) {
      console.error("Login failed:", err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current?.focus();
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Google response:", {
        credential: credentialResponse.credential,
        decoded,
      });

      try {
        // First try to login
        const response = await api.post("api/auth/google/google-login", {
          token: credentialResponse.credential,
        });

        const access = response?.data?.accessToken;
        localStorage.setItem("token", access);
        setAuth({ user: decoded.email, pwd: "", access });
        navigate("/");
        navigate(0);
      } catch (loginErr: any) {
        // If login fails with 404 (user not found), try registration
        if (loginErr.response?.status === 404) {
          const registerResponse = await api.post(
            "api/auth/google/google-register",
            {
              token: credentialResponse.credential,
            }
          );

          const access = registerResponse?.data?.token;
          console.log("Google registration response:", registerResponse);
          localStorage.setItem("token", access);
          setAuth({ user: decoded.email, pwd: "", access });
          navigate("/");
          navigate(0);
        } else {
          throw loginErr; // Re-throw other errors
        }
      }
    } catch (err: any) {
      console.error("Google auth error:", err);
      setErrMsg(
        err.response?.status === 401
          ? "Google Authentication Failed"
          : "Login Failed"
      );
      errRef.current?.focus();
    }
  };

  // Add debug logging
  const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
  console.log("Google OAuth Client ID:", clientId); // Temporary debug log

  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-form-section">
            <h1 className="auth-heading">Sign In</h1>
            <form onSubmit={handleSubmit} className="auth-form">
              {errMsg && (
                <p ref={errRef} className="error-message" aria-live="assertive">
                  {errMsg}
                </p>
              )}

              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Email Address:
                </label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  className="form-control"
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Sign In
              </button>

              <div className="social-login">
                <p>Or sign in with:</p>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrMsg("Google Login Failed")}
                  width="100%"
                />
              </div>

              <div className="auth-links">
                <p>
                  Need an Account? <Link to="/register">Sign Up</Link>
                </p>
                <p>
                  <Link to="/reset-password">Forgot Password?</Link>
                </p>
              </div>
            </form>
          </div>

          {/* <div className="auth-image-section">
            <img src={backgroundImage} alt="Login" />
          </div> */}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
