import { Heading } from "@chakra-ui/react";
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
} from "../data/constants";
import countries from "../data/countries";
import Customer from "../entities/Customer";
import APIClient, { axiosInstance } from "../services/api-client";
import "../index.css";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { UserPayload, UserResponse, CustomerPayload } from "../types/forms";

const userApiClient = new APIClient<UserResponse, UserPayload>(USERS_ENDPOINT);
const customerApiClient = new APIClient<Customer, CustomerPayload>(
  CUSTOMERS_ENDPOINT
);

const Register = () => {
  const jwt = localStorage.getItem("token");
  if (jwt) return <Navigate to="/songs" />;

  const navigate = useNavigate();

  //defining ref hooks
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const lastnameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  //defining state hooks
  const [firstname, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstnameFocus, setFirstNameFocus] = useState(false);

  const [lastname, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastnameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [country, setCountry] = useState("");
  const [countryFocus, setCountryFocus] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [birthDate, setBirthDate] = useState("");
  const [birthDateFocus, setBirthDateFocus] = useState(false);

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

  useEffect(() => {
    firstnameRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstname));
  }, [firstname]);

  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastname));
  }, [lastname]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [firstname, lastname, email, password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userPayload: UserPayload = {
        name: firstname + " " + lastname,
        email: email,
        password: password,
      };

      // First create the user
      const userResponse = await userApiClient.post(userPayload);
      const userId = userResponse._id;

      try {
        // Then try to create the customer profile
        await customerApiClient.post({
          user: userId,
          country: country,
          phone_number: phone,
          birth_date: birthDate,
        });

        // If both succeed, clear the form and navigate
        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setMatchPassword("");
        setCountry("");
        setPhone("");
        setBirthDate("");

        navigate("/auth");
      } catch (customerError: any) {
        // If customer creation fails, show specific error but still allow login
        setErrMsg(
          `Account created successfully, but customer profile creation failed: ${
            customerError.response?.data?.message ||
            customerError.message ||
            "Unknown error"
          }. You can still login with your credentials.`
        );

        // Wait 3 seconds before redirecting to login
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      }
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
        "api/auth/google/google-register",
        {
          token: credentialResponse.credential,
        }
      );

      navigate("/auth");
    } catch (err: any) {
      console.error("Google registration error:", err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Account Already Exists");
      } else {
        setErrMsg(`Registration Failed: ${err.message}`);
      }
      errRef.current?.focus();
    }
  };

  return (
    <>
      <section className="login-container">
        <form onSubmit={handleSubmit} className="login-form" role="form">
          {errMsg !== "" && (
            <p ref={errRef} className={"errmsg"} aria-live="assertive">
              {errMsg}
            </p>
          )}

          <Heading as="h1">Register</Heading>
          <div className="form-group">
            <label htmlFor="firstname">
              First name:{" "}
              {validFirstName === true && (
                <FontAwesomeIcon icon={faCheck} className="valid" />
              )}
              {validFirstName === false && firstname !== "" && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              )}
            </label>
            <input
              className="form-control"
              type="text"
              id="firstname"
              name="firstname"
              ref={firstnameRef}
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstname}
              required
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
              aria-describedby="uidnote"
              aria-invalid={validFirstName ? "false" : "true"}
              placeholder="Enter first name..."
            />
          </div>
          {firstnameFocus === true &&
            firstname !== "" &&
            validFirstName === false && (
              <p id="uidnote" className={"instructions"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
            )}

          <div className="form-group">
            <label htmlFor="lastname">
              Last name:{" "}
              {validLastName === true && (
                <FontAwesomeIcon icon={faCheck} className="valid" />
              )}
              {validLastName === false && lastname !== "" && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              )}
            </label>
            <input
              className="form-control"
              type="text"
              id="lastname"
              name="lastname"
              ref={lastnameRef}
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
              value={lastname}
              required
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
              aria-describedby="uidnote"
              placeholder="Enter last name..."
            />
          </div>
          {lastnameFocus === true &&
            lastname !== "" &&
            validLastName === false && (
              <p id="uidnote" className={"instructions"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
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
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Lowercase letters, numbers, special characters are allowed.
            </p>
          )}

          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              className="form-control"
              type="text"
              id="phone"
              name="phone"
              ref={phoneRef}
              autoComplete="off"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
              placeholder="Enter phone number..."
            />
          </div>
          {phoneFocus && phone !== "" && (
            <p className="instructions">
              <FontAwesomeIcon icon={faInfoCircle} />
              Enter a valid phone number.
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
            <label htmlFor="birthDate">Date of birth</label>
            <input
              className="form-control"
              id="birthDate"
              name="birthDate"
              autoComplete="off"
              type="date"
              onChange={(e) => setBirthDate(e.target.value)}
              value={birthDate}
              required
              onFocus={() => setBirthDateFocus(true)}
              onBlur={() => setBirthDateFocus(false)}
              placeholder="Date of birth"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password:
              {validPassword === true && (
                <FontAwesomeIcon icon={faCheck} className={"valid"} />
              )}
              {(validPassword !== true || password === "") && (
                <FontAwesomeIcon icon={faTimes} className={"hide"} />
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

          {passwordFocus === true && validPassword === false && (
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

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
        <p>
          Already registered?
          <br />
          <span className="line">
            <Link to="/auth">Sign In</Link>
          </span>
        </p>
        <div className="social-login">
          <p>Or create a new account with:</p>
          <GoogleLogin
            text="signup_with"
            shape="rectangular"
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setErrMsg("Google Sign Up Failed");
            }}
          />
        </div>
      </section>
    </>
  );
};

export default Register;
