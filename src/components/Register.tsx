import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { CUSTOMER_URL, REGISTER_URL } from "../services/api-client";
import { useState, useEffect, useRef } from "react";
import { AxiosError } from "axios";
import countries from "../data/countries";

const NAME_REGEX = /^[A-z][A-z0-9-_]{4,50}$/;
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,50}$/;

const Register = () => {
  //defining ref hooks
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const lastnameRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const membershipRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  //defining state hooks
  const [firstname, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstnameFocus, setFirstNameFocus] = useState(false);

  const [lastname, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastnameFocus, setLastNameFocus] = useState(false);

  const [username, setUsername] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [membership, setMembership] = useState("");
  const [membershipFocus, setMembershipFocus] = useState(false);

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

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [selected, setSelected] = useState("");

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
    setValidUserName(NAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [username, firstname, lastname, email, password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submitted");
    // if button enabled with JS hack
    // const v1 = NAME_REGEX.test(firstname);
    // const v2 = NAME_REGEX.test(lastname);
    // const v3 = NAME_REGEX.test(username);
    // const v4 = EMAIL_REGEX.test(email);
    // const v5 = PWD_REGEX.test(password);
    // if (!v1 || !v2 || !v3 || !v4 || !v5) {
    //   setErrMsg("Invalid Entry");
    //   return;
    // }
    try {
      console.log({
        username,
        password,
        email,
        first_name: firstname,
        last_name: lastname,
      });
      const response = await axios.post(REGISTER_URL, {
        username,
        password,
        email,
        first_name: firstname,
        last_name: lastname,
      });

      const res = await axios.post(CUSTOMER_URL, {
        user_id: response.data.id,
        phone,
        country,
        birthDate,
        membership,
      });
      console.log(response?.data);
      // console.log(response?.accessToken);
      // console.log(JSON.stringify(response));
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUsername("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setMatchPassword("");
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
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <form onSubmit={handleSubmit} className="form">
            {errMsg !== "" && (
              <p ref={errRef} className={"errmsg"} aria-live="assertive">
                {errMsg}
              </p>
            )}

            <Heading as="h1">Register</Heading>
            <label htmlFor="firstname">
              First name:{" "}
              {validFirstName === true && (
                <FontAwesomeIcon icon={faCheck} className="valid" />
              )}
              {(validFirstName === true || firstname !== "") && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              )}
            </label>

            <input
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

            <br />

            <label htmlFor="lastname">
              Last name:{" "}
              {validLastName === true && (
                <FontAwesomeIcon icon={faCheck} className="valid" />
              )}
              {(validLastName === true || lastname !== "") && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              )}
            </label>

            <input
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

            <br />

            <label htmlFor="username">
              First name:{" "}
              {validUserName === true && (
                <FontAwesomeIcon icon={faCheck} className="valid" />
              )}
              {(validUserName === true || username !== "") && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              )}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              ref={usernameRef}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
              aria-describedby="uidnote"
              placeholder="Enter username..."
            />
            {usernameFocus === true &&
              username !== "" &&
              validUserName === false && (
                <p id="uidnote" className={"instructions"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              )}

            <br />

            <label htmlFor="email">
              First name:{" "}
              {validEmail === true && (
                <FontAwesomeIcon icon={faCheck} className="valid" />
              )}
              {(validEmail === true || email !== "") && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              )}
            </label>
            <input
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

            <br />

            <label htmlFor="membership">Membership Status</label>
            <select
              id="membership"
              onChange={(e) => setMembership(e.target.value)}
              onFocus={() => setMembershipFocus(true)}
              onBlur={() => setMembershipFocus(false)}
            >
              <option disabled={true} value="">
                --Choose between Gold(G), Silver(S) and Bronze(B)--
              </option>
              <option value="G">G</option>
              <option value="S">S</option>
              <option value="B">B</option>
            </select>

            <br />

            <label htmlFor="country">Country</label>

            <select
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
                <option key={country.iso}>{country.name}</option>
              ))}
            </select>

            <br />

            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              ref={phoneRef}
              autoComplete="off"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
              placeholder="Enter Phone number ..."
            />

            <br />

            <label htmlFor="birthDate">Date of birth</label>
            <input
              id="birthDate"
              name="birthDate"
              ref={phoneRef}
              autoComplete="off"
              type="date"
              onChange={(e) => setBirthDate(e.target.value)}
              value={birthDate}
              required
              onFocus={() => setBirthDateFocus(true)}
              onBlur={() => setBirthDateFocus(false)}
              placeholder="Date of birth"
            />

            <br />

            <label htmlFor="password">
              Password:
              {validPassword === true && (
                <FontAwesomeIcon icon={faCheck} className={"valid"} />
              )}
              {validPassword !== true ||
                (password === "" && (
                  <FontAwesomeIcon icon={faTimes} className={"hide"} />
                ))}
            </label>

            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="pwdnote"
              type="password"
              placeholder="Enter password"
            />

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

            <br />

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
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPassword(e.target.value)}
              value={matchPassword}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              placeholder="Confirm password"
            />
            {matchFocus && !validMatch && (
              <p id="confirmnote" className={"instructions"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>
            )}

            <br />

            <Button
              disabled={
                validFirstName &&
                validLastName &&
                validUserName &&
                validPassword &&
                validMatch
              }
            >
              Sign Up
            </Button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
