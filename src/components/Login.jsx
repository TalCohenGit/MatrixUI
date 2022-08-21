import { set } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { loginUserAPI, refreshTokenAPI} from "../api";
import { DataContext } from "../context/DataContext";
import Register from "./Register";

const Login = ({setSeconds}) => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [needToRegister, setNeedToRegister] = useState(false);
  const { setAccessToken, setTimelimit } = useContext(DataContext);

  useEffect(() => {
    setErrMsg("");
  }, [userEmail, password]);

  useEffect(() => {
    setSeconds(0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken, refreshToken, timeLimit } = loginUserAPI(userEmail, password);
      setTimelimit(timeLimit)
      setAccessToken(accessToken);
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
      localStorage.setItem("timeLimit", timeLimit)
    } catch (e) {
      console.log("error in handleSubmit: ", e);
      setErrMsg(e);
    }
  };

  const register = () => {
    setNeedToRegister(true);
  };

  return needToRegister ? (
    <Register setNeedToRegister={setNeedToRegister} />
  ) : (
    <div className="login-part">
      <h1>נא להכניס את הפרטים להזדהות</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>דואר אלקטרוני</label>
          <input
            type="text"
            id="userEmail"
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <label>סיסמה</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button className="createInvoice-button" type="submit">
            התחבר
          </button>
        </div>
        <p>משתמש חדש?</p>
        <button className="createInvoice-button" onClick={() => register()}>
          הרשמה
        </button>
      </form>
      {errMsg ? <p> שם משתמש או סיסמה שגויים, נא לנסות שוב </p> : null}
    </div>
  );
};

export default Login;
