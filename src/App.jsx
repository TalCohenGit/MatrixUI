import React, { useEffect, useState } from "react";
import MatrixPage from "./components/MatrixPage";
import Login from "./components/Login";

const App = () => {
  const [refreshToken, setRefreshToken] = useState("");
  const [seconds, setSeconds] = useState(0);

  const getRefreshToken = () => {
    const newRefreshToken = localStorage.getItem("refreshToken");
    if (newRefreshToken) {
      return true;
    }
    return false;
  };

  useEffect(() => {}, [refreshToken]);

  if (!refreshToken && !getRefreshToken()) {
    return <Login setSeconds={setSeconds} setRefreshToken={setRefreshToken} />;
  }
  return (
    <MatrixPage
      seconds={seconds}
      setSeconds={setSeconds}
      setRefreshToken={setRefreshToken}
    />
  );
};

export default App;
