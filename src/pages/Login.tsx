import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ENDPOINT } from "../data/constants";
import useAuth from "../hooks/useAuth";
import APIClient, { axiosInstance } from "../services/api-client";
import Cookies from "js-cookie";
import "../index.css";

const apiClient = new APIClient<Auth>(LOGIN_ENDPOINT);

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

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post<any | Error>(LOGIN_ENDPOINT, {
        email: user,
        password: pwd,
      });

      // Retrieve the access token from response body
      const access = response?.data?.accessToken;
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
    } catch (err: Error) {
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

  return (
    <>
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
            <input
              type="password"
              id="password"
              className="form-control"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>

        <p>
          Need an Account?
          <br />
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </section>
    </>
  );
};

export default Login;
