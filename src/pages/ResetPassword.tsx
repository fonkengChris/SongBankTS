import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../services/api-client";
import {
  REQUEST_RESET_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
} from "../data/constants";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post(REQUEST_RESET_ENDPOINT, { email });
      setMessage(
        "If an account exists with this email, you will receive password reset instructions."
      );
      setError("");
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
      setMessage("");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axiosInstance.post(RESET_PASSWORD_ENDPOINT, {
        token,
        password,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("tokenRef");

      setMessage("Password successfully reset. You can now login.");
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      setError("Failed to reset password. The link may be invalid or expired.");
    }
  };

  // Show request form if no token, otherwise show reset form
  return (
    <section className="login-container">
      <h1>{token ? "Reset Password" : "Request Password Reset"}</h1>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {!token ? (
        <form onSubmit={handleRequestReset} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Request Reset
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="login-form">
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </form>
      )}
    </section>
  );
};

export default ResetPassword;
