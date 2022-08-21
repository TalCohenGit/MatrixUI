import React, { useEffect, useState } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = ({ setNeedToRegister }) => {
  const [userEmail, setUserEmail] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false)

  const [lastName, setLastName] = useState("")
  const [validLastName, setValidLastName] = useState(false)

  const [phone, setPhone] = useState("")

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidUser(USER_REGEX.test(userEmail));
    console.log("validName:", USER_REGEX.test(userEmail));
  }, [userEmail]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(matchPwd === password);
    console.log("validMatch", validMatch);
  }, [password, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [userEmail, password, matchPwd]);


  const handleField = (value, setState, setValidation) => {
    setState(value)
    value? setValidation(true) : setValidation(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //register API
      setSuccess(true);
    } catch (e) {
      console.log("error in handleSubmit: ", e);
      setErrMsg(e);
    }
  };

  const disableRegistration = () => {
    return !validUser || !validPwd || !validMatch || !validFirstName || !validLastName
  }

  return success ? (
    <div>
      <h1> הרישום בוצע בהצלחה! </h1>
      <a href="#" onClick={() => setNeedToRegister(false)}>
        התחבר למערכת
      </a>
    </div>
  ) : (
    <div>
      <h1>נא להכניס את הפרטים לרישום למערכת</h1>
      <form onSubmit={handleSubmit}>
        <label>שם פרטי</label>
        <input
          type="text"
          id="userName"
          onChange={(e) => handleField(e.target.value, setFirstName, setValidFirstName)}
        />
        <label>שם משפחה</label>
        <input
          type="text"
          id="userName"
          onChange={(e) => handleField(e.target.value, setFirstName, setValidFirstName)}
        />
        <label>
          טלפון
        </label>
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
        <label>
          סיסמה
          <FontAwesomeIcon
            icon={faCheck}
            className={validPwd ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPwd || !password ? "hide" : "invalid"}
          />
        </label>
        <p
          className={
            pwdFocus && password && !validPwd
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
        <div>
          <button
            disabled={ disableRegistration? true : false}
            className="createInvoice-button"
            type="submit"
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
