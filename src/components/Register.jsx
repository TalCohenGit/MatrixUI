import React, { useContext, useEffect, useState } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { registerAPI } from "../api";
import { DataContext } from "../context/DataContext";

const USER_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = ({ setNeedToRegister }) => {
  const {businessName, setBusinessName} = useContext(DataContext)
  
  const [userEmail, setUserEmail] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [userPass, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);

  const [accountName, setAccountName] = useState("");

  const [phone, setPhone] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidUser(USER_REGEX.test(userEmail));
  }, [userEmail]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(userPass));
    setValidMatch(matchPwd === userPass);
  }, [userPass, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [userEmail, userPass, matchPwd]);

  const handleField = (value, setState, setValidation) => {
    setState(value);
    value ? setValidation(true) : setValidation(false);
  };

  const handleSubmit = async () => {
    try {
      await registerAPI(
        firstName,
        lastName,
        phone,
        userEmail,
        userPass,
        accountName
      );
      setSuccess(true);
      localStorage.setItem("businessName", businessName)
    } catch (e) {
      console.log("error in handleSubmit: ", e);
      setErrMsg(e);
    }
  };

  const disableRegistration = () => {
    const validation =  !validUser ||
    !validPwd ||
    !validMatch ||
    !validFirstName ||
    !validLastName
    || !businessName
    return validation
  };

  return success ? (
    <div>
      <h1> הרישום בוצע בהצלחה! </h1>
      <a href="#" onClick={() => setNeedToRegister(false)}>
        התחבר למערכת
      </a>
    </div>
  ) : (
    <div className="login-part">
      <h1>נא להכניס את הפרטים לרישום למערכת</h1>
      {/* <form onSubmit={handleSubmit}> */}
      <form>
        <div className="user-details">
          <label>שם פרטי</label>
          <input
            type="text"
            id="userName"
            onChange={(e) =>
              handleField(e.target.value, setFirstName, setValidFirstName)
            }
          />
          <label>שם משפחה</label>
          <input
            type="text"
            id="userName"
            onChange={(e) =>
              handleField(e.target.value, setLastName, setValidLastName)
            }
          />
          <label>טלפון</label>
          <input
            type="text"
            id="phone"
            onChange={(e) => setPhone(e.target.value)}
          />
          <label>
            דואר אלקטרוני
            <FontAwesomeIcon
              icon={faCheck}
              className={validUser ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validUser || !userEmail ? "hide" : "invalid"}
            />
          </label>
          <input
            type="text"
            id="userEmail"
            onChange={(e) => setUserEmail(e.target.value)}
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />
          <label>שם משתמש</label>
          <input
            type="text"
            id="accountName"
            onChange={(e) => setAccountName(e.target.value)}
          />
          <label>שם העסק</label>
          <input
            type="text"
            id="businessName"
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <label>
            סיסמה
            <FontAwesomeIcon
              icon={faCheck}
              className={validPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPwd || !userPass ? "hide" : "invalid"}
            />
          </label>
          <p
            className={
              pwdFocus && userPass && !validPwd
                ? "instructions"
                : "hide-instructions"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            4-24 אותיות
            <br />
            חייבים להתחיל באותיות.
            <br />
            יש לשים אותיות גדולות, קטנות, מספרים וסימנים.
            <br />
            אפשר לשים אותיות, מספרים, מקף ומקף תחתון.
          </p>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <label>
            אימות סיסמה
            <FontAwesomeIcon
              icon={faCheck}
              className={validMatch && matchPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validMatch || !matchPwd ? "hide" : "invalid"}
            />
          </label>
          <input
            type="password"
            id="matchPwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p
            className={
              matchFocus && matchPwd && !matchPwd
                ? "instructions"
                : "hide-instructions"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            יש לחזור על הסיסמה הקודמת.
          </p>
        </div>

        <div>
          <button
            disabled={disableRegistration() ? true : false}
            className="login-button"
            onClick={() => handleSubmit()}
          >
            הירשם
          </button>
        </div>
        <div>
          <h1> כבר רשום?</h1>
          <a href="#" onClick={() => setNeedToRegister(false)}>
            התחבר למערכת
          </a>
        </div>
      </form>
      {errMsg ? <p> שם משתמש או סיסמה שגויים, נא לנסות שוב </p> : null}
    </div>
  );
};

export default Register;
