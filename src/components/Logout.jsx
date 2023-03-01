import React, { useState, useRef } from "react";
import ErrorList from "./ErrorsList";
import axios from "axios";
// import { logout } from '../utils/utils';
import { logoutAPI } from "../api";
const errorLogUrl =
  "https://script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec?type=getdocslog";

const errorLog = async (url) => {
  return await axios.get(url, { withCredentials: false });
};

const Logout = ({ setAccessToken, setRefreshToken }) => {
  const [errorsList, setErrorsList] = useState({
    toShow: false,
    data: null,
  });
  const logout = async (setAccessToken, setRefreshToken) => {
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("timeLimit");
    localStorage.removeItem("userEmail");
    await logoutAPI();
    window.location = window.location.href;
  };

  const showErrorLog = async () => {
    errorLog(errorLogUrl)
      .then((res) => res.data)
      .then((data) => {
        console.log({ data });
        setErrorsList({ toShow: true, data: data });
      })
      .catch((error) => console.log({ error }));
  };

  const handleLogout = async () => {
    await logout(setAccessToken, setRefreshToken);
  };

  return (
    <div>
      <button className="login-button" onClick={() => handleLogout()}>
        ניתוק מהמערכת
      </button>
      <button className="log-button" onClick={() => showErrorLog()}>
        לוג
      </button>
      {errorsList.toShow && <ErrorList data={errorsList.data} setErrorsList={setErrorsList} />}
    </div>
  );
};

Logout.propTypes = {};

export default Logout;
