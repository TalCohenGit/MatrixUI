import React, { useEffect, useContext, useState } from "react";
import "./App.scss";
import "normalize.css";
import AddCustomer from "./components/AddCustomer";
import Table from "./components/Table";
import Login from "./components/Login";
import {
  getCustomersAPI,
  getProductsAPI,
  sendTableAPI,
  saveTablesAPI,
  loadTablesAPI,
  getDriverList,
  refreshTokenAPI,
  logoutAPI,
} from "./api";
import { DataContext } from "./context/DataContext";
import {
  getProductsNameKeyMap,
  updateBalanceTable,
  getUniqProducts,
} from "./utils/utils";
import CircularProgress from "@mui/material/CircularProgress";
import {
  numOfColBeforeProducts,
  numOfColAfterProducts,
} from "./utils/constants";
import Modal from "./common/components/Modal/Modal";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

function App() {
  const {
    matrixData,
    setMatrixData,
    setCustomers,
    customerName,
    setCustomerName,
    getNewCustomerData,
    setError,
    setBalanceTableData,
    balanceTableData,
    setProductsMap,
    matrixComments,
    setMatrixComments,
    products,
    setProducts,
    matrixID,
    drivers,
    setDrivers,
    accessToken,
    setAccessToken,
    timeLimit,
    setTimelimit,
  } = useContext(DataContext);

  const [isOpen, toggleModal] = useState(true);
  const [validationErrors, setValidationError] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [refreshToken, setRefreshToken] = useState("");
  const axiosPrivate = useAxiosPrivate();
  let interval;

  const getTableTitle = () => {
    const tableTitle = [
      "שם לקוח",
      "מזהה",
      "טלפון",
      "איסוף",
      "מאושר",
      "סוג מסמך",
      "הערות למסמך",
      "",
    ];
    return tableTitle;
  };

  const addCustomerToTable = () => {
    try {
      const currentMatrixData = [...matrixData];
      if (!currentMatrixData.length) {
        currentMatrixData.push(getTableTitle());
      }
      const numOfColAfterCustomerData =
        currentMatrixData[0].length - numOfColBeforeProducts;
      const newCustomerData = getNewCustomerData();
      currentMatrixData.push([
        ...newCustomerData,
        ...Array(numOfColAfterCustomerData).fill(0),
      ]);
      setMatrixData(currentMatrixData);
      const productsNumber = numOfColAfterCustomerData - numOfColAfterProducts;
      if (productsNumber > 0) {
        const commentsRow = Array().fill(null);
        const newMatrixComment = [...matrixComments];
        newMatrixComment.push(commentsRow);
        setMatrixComments(newMatrixComment);
      }
      setCustomerName("");
    } catch (e) {
      console.log(e, "addCustomerToTable");
    }
  };

  const addProductToTable = (selectedProductNames) => {
    const currentMatrix = matrixData;
    if (!currentMatrix.length) {
      currentMatrix.push(getTableTitle());
    }
    const columnIndxToAdd = currentMatrix[0].length - numOfColAfterProducts;
    const arrayWithColumn = currentMatrix.map((row, rowIndex) => {
      let newArr;
      if (selectedProductNames.length > 0) {
        if (rowIndex == 0) {
          newArr = [
            ...row.slice(0, 3),
            ...selectedProductNames,
            ...row.slice(columnIndxToAdd, currentMatrix[0].length),
          ];
        } else {
          newArr = [
            ...row.slice(0, 3),
            ...Array(selectedProductNames.length).fill(0),
            ...row.slice(columnIndxToAdd, currentMatrix[0].length),
          ];
          const newMatrixComment = [...matrixComments];
          if (newMatrixComment.length > 0) {
            newMatrixComment[rowIndex - 1].push(null);
          } else {
            newMatrixComment[rowIndex - 1] = [null];
          }
          setMatrixComments(newMatrixComment);
        }
      } else {
        newArr = [
          ...row.slice(0, 3),
          ...row.slice(columnIndxToAdd, currentMatrix[0].length),
        ];
      }
      return newArr;
    });
    setMatrixData(arrayWithColumn);
    const currentBalanceData = updateBalanceTable(
      selectedProductNames,
      products
    );
    setBalanceTableData(currentBalanceData);
  };

  const validationModal = (validationErrors) => {
    if (validationErrors.length > 0) {
      setValidationError(validationErrors);
      toggleModal(true);
    }
  };

  const dataDoubles = validationErrors.map((validation) => {
    return (
      <div>{`תקלה בערך: ${validation["ערך "]} בשורות: ${validation["בשורות "]} בכותרת: ${validation["בכותרת "]}`}</div>
    );
  });

  const calcProductsSum = (n) => {
    let sum = 0;
    matrixData.forEach((rowData, rowDataIndex) => {
      if (rowDataIndex === 0) {
        return;
      }
      sum += Number(rowData[n]);
    });
    const currentData = [...balanceTableData];
    currentData[2][n] = sum;
    currentData[3][n] = currentData[1][n] - sum;
    setBalanceTableData(currentData);
  };

  useEffect(() => {
    if (getRefreshToken()) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  useEffect(() => {
    (async () => {
      if (getRefreshToken()) {
        let currentTimeLimit = timeLimit;
        if (!currentTimeLimit) {
          currentTimeLimit = localStorage.getItem("timeLimit");
          setTimelimit(timeLimit);
        }
        if (currentTimeLimit && seconds > currentTimeLimit) {
          setAccessToken("");
          setRefreshToken("");
          clearInterval(interval);
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("timeLimit");
          await logoutAPI();
        }
      }
    })();
  }, [seconds]);

  useEffect(() => {
    setSeconds(0);
  }, [matrixData]);

  useEffect(() => {
    (async () => {
      if (refreshToken) {
        const { accessToken } = await refreshTokenAPI(refreshToken);
        setAccessToken(accessToken);
      }
    })();
  }, [refreshToken]);

  useEffect(() => {
    (async () => {
      if (refreshToken) {
        const savedData = loadTablesAPI(axiosPrivate);
        if (savedData) {
          const { matrixData, commentMatrix } = savedData;
          setMatrixData(matrixData);
          setMatrixComments(commentMatrix);
        }
        const productsData = await getProductsAPI(
          axiosPrivate,
          validationModal
        );
        const uniqProducts =
          productsData.length > 0 ? getUniqProducts(productsData) : undefined;
        setProducts(uniqProducts);
        const productsMap = getProductsNameKeyMap(uniqProducts);
        setProductsMap(productsMap);
        const customerList = await getCustomersAPI(axiosPrivate, productsMap);
        setCustomers(customerList);
        const driverList = await getDriverList(axiosPrivate);
        setDrivers(driverList);
      }
    })();
  }, [refreshToken]);

  useEffect(() => {
    const onUnload = () => {
      const userID = "1234";
      if (matrixData.length > 0) {
        saveTablesAPI(matrixID, userID, matrixData, matrixComments, drivers);
      }
    };

    window.addEventListener("beforeunload", onUnload);

    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const getRefreshToken = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      setRefreshToken(refreshToken);
      return true;
    }
    return false;
  };

  return !refreshToken ? (
    <Login setSeconds={setSeconds} />
  ) : drivers?.length ? (
    <div className="app-container">
      <h1>גת אביגדור קופה רושמת</h1>
      <Modal
        isOpen={isOpen}
        toggleModal={toggleModal}
        modalHeader={"נא לטפל בכפילויות של הנתונים"}
      >
        <div>{dataDoubles}</div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={() => toggleModal(false)}>
            בטל
          </button>
        </div>
      </Modal>
      <AddCustomer
        customerName={customerName}
        setCustomerName={setCustomerName}
        addCustomerToTable={addCustomerToTable}
        sendTableAPI={sendTableAPI}
        addProductToTable={addProductToTable}
        axiosPrivate={axiosPrivate}
      />

      <Table
        data={matrixData}
        setData={setMatrixData}
        tableName="matrix"
        cb={calcProductsSum}
        bgColor="#F5FFFA"
      />
      <Table
        data={balanceTableData}
        setData={setBalanceTableData}
        tableName="prototype"
        disabled
        bgColor="#F0FFFF"
      />
    </div>
  ) : (
    <div className="loader">
      <CircularProgress />
    </div>
  );
}

export default App;
