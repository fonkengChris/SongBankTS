import { Heading, useToast } from "@chakra-ui/react";
import {
  faCheck,
  faInfoCircle,
  faTimes,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  CUSTOMERS_ENDPOINT,
  EMAIL_REGEX,
  NAME_REGEX,
  PWD_REGEX,
  USERS_ENDPOINT,
  PHONE_NUMBER_REGEX,
} from "../data/constants";
import countries from "../data/countries";
import Customer from "../entities/Customer";
import APIClient, { axiosInstance } from "../services/api-client";
import "../index.css";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { UserPayload, UserResponse, CustomerPayload } from "../types/forms";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "../styles/auth.css";

const userApiClient = new APIClient<UserResponse, UserPayload>(USERS_ENDPOINT);
const customerApiClient = new APIClient<Customer, CustomerPayload>(
  CUSTOMERS_ENDPOINT
);

const Register = () => {
  const jwt = localStorage.getItem("token");
  if (jwt) return <Navigate to="/songs" />;

  const navigate = useNavigate();
  const toast = useToast();

  //defining ref hooks
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  //defining state hooks
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [country, setCountry] = useState("");
  const [countryFocus, setCountryFocus] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validPhone, setValidPhone] = useState(false);

  // Add loading state for Google button
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Verify client ID on component mount
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
    if (clientId) {
      setGoogleLoaded(true);
      console.log("Google OAuth Client ID loaded:", clientId);
    } else {
      console.error(
        "Google OAuth Client ID not found in environment variables"
      );
    }
  }, []);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [name, email, password, matchPassword]);

  useEffect(() => {
    setValidPhone(PHONE_NUMBER_REGEX.test(phone));
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userPayload: UserPayload = {
        name: name,
        email: email,
        password: password,
      };

      const response = await userApiClient.post(userPayload);
      const { accessToken } = response;

      // Store the token and redirect
      localStorage.setItem("token", accessToken);

      try {
        await customerApiClient.post({
          user: response.user._id,
          country: country,
        });
      } catch (customerError: any) {
        console.error("Customer profile creation failed:", customerError);
      }

      // Navigate to songs page directly instead of auth
      navigate("/");
      navigate(0); // Refresh to update the user context
    } catch (error) {
      const err = error as AxiosError;
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Google response:", {
        credential: credentialResponse.credential,
        decoded,
      });

      const response = await axiosInstance.post(
        "/api/auth/google/google-register",
        {
          token: credentialResponse.credential,
        }
      );


      localStorage.setItem("token", response.data.accessToken);
      toast({
        title: "Registration successful",
        description: "Registration successful",
        status: "success",
        duration: 3000,
      });

      navigate("/");
    } catch (err: any) {
      console.error("Google registration error:", err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Account Already Exists - Please Login Instead");
        setTimeout(() => navigate("/auth"), 2000);
      } else {
        setErrMsg(`Registration Failed: ${err.message}`);
      }
      errRef.current?.focus();
    }
  };

  // Add this function to check if form is valid
  const isFormValid = () => {
    return (
      validName && validEmail && validPassword && validMatch && country !== ""
    );
  };

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || ""}
    >
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-form-section">
            <h1 className="auth-heading">Registration Form</h1>
            <form onSubmit={handleSubmit} className="auth-form">
              {errMsg && (
                <p ref={errRef} className="error-message" aria-live="assertive">
                  {errMsg}
                </p>
              )}

              <div className="form-group">
                <label htmlFor="name">
                  Name:{" "}
                  {validName && (
                    <FontAwesomeIcon icon={faCheck} className="valid" />
                  )}
                  {!validName && name && (
                    <FontAwesomeIcon icon={faTimes} className="invalid" />
                  )}
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="name"
                  name="name"
                  ref={nameRef}
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                  aria-describedby="uidnote"
                  aria-invalid={validName ? "false" : "true"}
                  placeholder="Enter full name..."
                />
              </div>
              {nameFocus && name && !validName && (
                <p id="uidnote" className={"instructions"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  3 to 50 characters.
                  <br />
                  Letters, spaces, underscores, hyphens allowed.
                </p>
              )}

              <div className="form-group">
                <label htmlFor="email">
                  Email:{" "}
                  {validEmail === true && (
                    <FontAwesomeIcon icon={faCheck} className="valid" />
                  )}
                  {validEmail === false && email !== "" && (
                    <FontAwesomeIcon icon={faTimes} className="invalid" />
                  )}
                </label>
                <input
                  className="form-control"
                  id="email"
                  name="email"
                  type="email"
                  ref={emailRef}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  placeholder="Enter Email address ..."
                  aria-describedby="emailnote"
                />
              </div>
              {emailFocus === true && email !== "" && validEmail === false && (
                <p id="emailnote" className={"instructions"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must be a valid email address format.
                  <br />
                  Example: username@domain.com
                </p>
              )}

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  className="form-control"
                  id="country"
                  name="country"
                  autoComplete="off"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  onFocus={() => setCountryFocus(true)}
                  onBlur={() => setCountryFocus(false)}
                  placeholder="Enter Country ..."
                >
                  <option disabled={true} value="">
                    --Select Country Name--
                  </option>
                  {countries.map((country) => (
                    <option value={country.iso} key={country.iso}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password:
                  {validPassword && (
                    <FontAwesomeIcon icon={faCheck} className={"valid"} />
                  )}
                  {!validPassword && password !== "" && (
                    <FontAwesomeIcon icon={faTimes} className={"invalid"} />
                  )}
                </label>
                <div className="password-input-wrapper">
                  <input
                    className="form-control"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="pwdnote"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
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

              {(passwordFocus || password !== "") && !validPassword && (
                <p id="pwdnote" className={"instructions"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              )}

              <div className="form-group">
                <label htmlFor="confirm_pwd">
                  Confirm Password:
                  {validMatch === true && matchPassword !== "" && (
                    <FontAwesomeIcon icon={faCheck} className={"valid"} />
                  )}
                  {validMatch === false ||
                    (matchPassword === "" && (
                      <FontAwesomeIcon icon={faTimes} className={"hide"} />
                    ))}
                </label>
                <div className="password-input-wrapper">
                  <input
                    className="form-control"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_pwd"
                    onChange={(e) => setMatchPassword(e.target.value)}
                    value={matchPassword}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              {matchFocus && !validMatch && (
                <p id="confirmnote" className={"instructions"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={!isFormValid() || loading}
              >
                {loading ? "Signing Up..." : "Register Now"}
              </button>

              <div className="social-login">
                <p>Or create account with:</p>
                {googleLoaded && (
                  <GoogleLogin
                    text="signup_with"
                    shape="rectangular"
                    theme="outline"
                    size="large"
                    width="100%"
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrMsg("Google Sign Up Failed")}
                  />
                )}
              </div>

              <div className="auth-links">
                <p>
                  Already have an account? <Link to="/auth">Sign In</Link>
                </p>
              </div>
            </form>
          </div>

          {/* <div className="auth-image-section">
            <img src={backgroundImage} alt="Registration" />
          </div> */}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
