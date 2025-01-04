import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { CHANGE_PASSWORD_ENDPOINT, PWD_REGEX } from "../data/constants";
import APIClient, { axiosInstance } from "../services/api-client";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import CurrentUser from "../entities/CurrentUser";

const ChangePassword = () => {
  const navigate = useNavigate();
  const user = jwtDecode<CurrentUser>(localStorage.getItem("token")!);
  const apiClient = new APIClient<{ old_password: String; password: String }>(
    CHANGE_PASSWORD_ENDPOINT
  );

  const endpoint = CHANGE_PASSWORD_ENDPOINT + user._id + "/";

  const [old_password, setOldPassword] = useState("");
  const [validOldPassword, setValidOldPassword] = useState(false);
  const [oldPasswordFocus, setOldPasswordFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setValidOldPassword(PWD_REGEX.test(old_password));
  }, [password]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(endpoint, {
        old_password,
        password,
      });
      console.log(response);
    } catch (error) {}
  };

  return (
    <section className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="old_password">
            Old Password:
            {validPassword === true && (
              <FontAwesomeIcon icon={faCheck} className="valid" />
            )}
            {validPassword !== true ||
              (password === "" && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              ))}
          </label>
          <input
            className="form-control"
            id="old_password"
            onChange={(e) => setOldPassword(e.target.value)}
            value={old_password}
            required
            aria-invalid={validPassword ? "false" : "true"}
            aria-describedby="pwdnote"
            type="password"
            placeholder="Enter Old password"
          />
        </div>

        {oldPasswordFocus === true && validPassword === false && (
          <p id="pwdnote" className="instructions">
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
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
          <label htmlFor="password">
            New Password:
            {validPassword === true && (
              <FontAwesomeIcon icon={faCheck} className="valid" />
            )}
            {validPassword !== true ||
              (password === "" && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              ))}
          </label>
          <input
            className="form-control"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            aria-invalid={validPassword ? "false" : "true"}
            aria-describedby="pwdnote"
            type="password"
            placeholder="Enter New password"
          />
        </div>

        {passwordFocus === true && validPassword === false && (
          <p id="pwdnote" className="instructions">
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
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
            Confirm New Password:
            {validMatch === true && matchPassword !== "" && (
              <FontAwesomeIcon icon={faCheck} className="valid" />
            )}
            {validMatch === false ||
              (matchPassword === "" && (
                <FontAwesomeIcon icon={faTimes} className="invalid" />
              ))}
          </label>
          <input
            className="form-control"
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPassword(e.target.value)}
            value={matchPassword}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            placeholder="Confirm New password"
          />
        </div>

        {matchFocus && !validMatch && (
          <p id="confirmnote" className="instructions">
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>
        )}

        <div className="form-group" style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate(`/users/${user._id}`)}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Change Password
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChangePassword;
