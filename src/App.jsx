import React, { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MatrixPage from "./pages/MatrixPage";
import Login from "./pages/Login";
import ErpSelect from "./pages/ErpSelect";
import Register from "./pages/Register";
import ConfigPage from "./pages/ConfigPage";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { DataContext } from "./context/DataContext";


const App = () => {
  const axiosPrivate = useAxiosPrivate();

  const [refreshToken, setRefreshToken] = useState("");
  const [seconds, setSeconds] = useState(0);
  const {finishedConfigStage} = useContext(DataContext)

  const existRefreshToken = () => {
    const newRefreshToken = localStorage.getItem("refreshToken");
    console.log("newRefreshToken", newRefreshToken)
    if (newRefreshToken && newRefreshToken !== "undefined") {
      return true;
    }
    return false;
  };

  // useEffect(() => {}, [refreshToken]);

  const MainPage =
    (!refreshToken && !existRefreshToken()) || !finishedConfigStage ? (
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
        <Route path="/register" element={<Register setRefreshToken={setRefreshToken}/>}/>
        <Route path="/config" element={<ConfigPage axiosPrivate={axiosPrivate}/>}/>
      </Routes>

    </div>
  );
};

export default App;
