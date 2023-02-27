import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MatrixPage from "./pages/MatrixPage";
import Login from "./pages/Login";
import ErpSelect from "./pages/ErpSelect";
import Register from "./pages/Register";
import ConfigPage from "./pages/ConfigPage";
import useAxiosPrivate from "./hooks/useAxiosPrivate";


const App = () => {
  const axiosPrivate = useAxiosPrivate();

  const [refreshToken, setRefreshToken] = useState("");
  const [seconds, setSeconds] = useState(0);

  const getRefreshToken = () => {
    const newRefreshToken = localStorage.getItem("refreshToken");
    if (newRefreshToken) {
      return true;
    }
    return false;
  };

  // useEffect(() => {}, [refreshToken]);

  const MainPage =
    !refreshToken && !getRefreshToken() ? (
      <Login setSeconds={setSeconds} setRefreshToken={setRefreshToken} />
    ) : (
      <MatrixPage
        seconds={seconds}
        setSeconds={setSeconds}
        setRefreshToken={setRefreshToken}
        axiosPrivate={axiosPrivate}
      />
    );

  return (
    <div>
      <Routes>
        <Route exact path="/" element={MainPage} />
        <Route path="/erp" element={<ErpSelect axiosPrivate={axiosPrivate}/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/config" element={<ConfigPage axiosPrivate={axiosPrivate}/>}/>
      </Routes>
    </div>
  );
};

export default App;
