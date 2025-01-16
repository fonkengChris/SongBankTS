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
      console.log("Login successful:", response);

      const access = response?.accessToken;
      localStorage.setItem("token", access);

      // Retrieve the refresh token from cookies
      const refresh = Cookies.get("csrftoken");
      if (refresh) {
        localStorage.setItem("tokenRef", refresh);
      }

      setAuth({ user, pwd, access });
      console.log(auth);
      setUser("");
      setPwd("");

      navigate("/songs");
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

      const response = await api.post("api/auth/google/google-login", {
        token: credentialResponse.credential,
      });

      const access = response?.data?.accessToken;
      localStorage.setItem("token", access);

      setAuth({ user: decoded.email, pwd: "", access });
      navigate("/songs");
      navigate(0);
    } catch (err: any) {
      console.error("Google login error:", err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 401) {
        setErrMsg("Google Authentication Failed");
      } else {
        setErrMsg(`Login Failed: ${err.message}`);
      }
      errRef.current?.focus();
    }
  };

  // const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
  // console.log("Client ID:", clientId);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
      <section className="login-container">
        <p
          ref={errRef}
          className={errMsg ? "errMsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Sign In</h1>

        <form onSubmit={handleSubmit} className="login-form">
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

          <div className="form-group">
            <Link to="/reset-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>

        <div className="social-login">
          <p>Or sign in with:</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setErrMsg("Google Login Failed");
            }}
          />
        </div>

        <p>
          Need an Account?
          <br />
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </section>
    </GoogleOAuthProvider>
  );
};

export default Login;
