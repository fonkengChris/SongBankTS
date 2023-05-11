import { Heading } from "@chakra-ui/react";
import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  CUSTOMERS_ENDPOINT,
  EMAIL_REGEX,
  NAME_REGEX,
  REGISTER_ENDPOINT,
} from "../data/constants";
import countries from "../data/countries";
import Customer from "../entities/Customer";
import useCustomer from "../hooks/useCustomer";
import useUserProfile from "../hooks/useUserProfile";
import APIClient, { axiosInstance } from "../services/api-client";
import User from "../entities/User";

const userApiClient = new APIClient<User>(REGISTER_ENDPOINT);
const customerApiClient = new APIClient<Customer>(CUSTOMERS_ENDPOINT);

const EditProfile = () => {
  const user = useUserProfile();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    useCustomer(user.user_id).then((cus) => {
      setCustomer(cus[0]);
    });
  }, []);

  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const lastnameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

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

  const [birth_date, setBirthDate] = useState("");
  const [birthDateFocus, setBirthDateFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

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
    setErrMsg("");
  }, [firstname, lastname, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // const userUpdate = axiosInstance.patch(U user?.user_id!, {
      //   id: user.user_id,
      //   first_name: firstname ? firstname : user.first_name,
      //   last_name: lastname ? lastname : user.last_name,
      //   email: email ? email : user.email,
      // });

      const res = customerApiClient.put(customer?.id!, {
        id: customer?.id!,
        user_id: customer?.user_id!,
        country: country ? country : customer?.country!,
        birth_date: birth_date ? birth_date : customer?.birth_date!,
      });

      setFirstName("");
      setLastName("");
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
      <section>
        <form onSubmit={handleSubmit} className="form-horizontal" role="form">
          {errMsg !== "" && (
            <p ref={errRef} className={"errmsg"} aria-live="assertive">
              {errMsg}
            </p>
          )}

          <Heading as="h1">Edit Profile</Heading>
          <div className="form-group">
            <label htmlFor="firstname" className="col-sm-2 control-label">
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
            <label htmlFor="lastname" className="col-sm-2 control-label">
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
            <label htmlFor="email" className="col-sm-2 control-label">
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

          <div className="form-group">
            <label htmlFor="country" className="col-sm-2 control-label">
              Country
            </label>
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
            <label htmlFor="birthDate" className="col-sm-2 control-label">
              Date of birth
            </label>
            <input
              className="form-control"
              id="birthDate"
              name="birthDate"
              autoComplete="off"
              type="date"
              onChange={(e) => setBirthDate(e.target.value)}
              value={birth_date}
              required
              onFocus={() => setBirthDateFocus(true)}
              onBlur={() => setBirthDateFocus(false)}
              placeholder="Date of birth"
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProfile;
