import React, { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import "../App.scss";
import "normalize.css";
import AddCustomer from "../components/AddCustomer";
import Table from "../components/Table";
import {
  getCustomersAPI,
  getProductsAPI,
  sendTableAPI,
  saveTablesAPI,
  loadTablesAPI,
  getDriverList,
  logoutAPI,
  getMatrixIDAPI,
} from "../api";
import { DataContext } from "../context/DataContext";
import {
  getProductsNameKeyMap,
  updateBalanceTable,
  getUniqProducts,
} from "../utils/utils";
import CircularProgress from "@mui/material/CircularProgress";
import {
  numOfColBeforeProducts,
  numOfColAfterProducts,
} from "../utils/constants";
import Modal from "../common/components/Modal/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function MatrixPage({ seconds, setSeconds, setRefreshToken }) {
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
    drivers,
    setDrivers,
    accessToken,
    setAccessToken,
    timeLimit,
    setTimelimit,
    userID,
    matrixID,
    setMatrixID,
    email,
    password,
  } = useContext(DataContext);

  const [isOpen, toggleModal] = useState(true);
  const [validationErrors, setValidationError] = useState([]);
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
    interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  useEffect(() => {
    (async () => {
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
    })();
  }, [seconds]);

  useEffect(() => {
    setSeconds(0);
  }, [matrixData]);

  //   useEffect(() => {
  //     (async () => {
  //       if (!refreshToken) {
  //         const { accessToken } = await refreshTokenAPI(refreshToken);
  //         setAccessToken(accessToken);
  //       }
  //     })();
  //   }, [refreshToken]);

  const onUnload = async (e) => {
    // e.preventDefault();
    const matrixID = await getMatrixIDAPI(axiosPrivate, email, password);
    if (matrixData?.length > 1) {
      await saveTablesAPI(
        axiosPrivate,
        matrixID,
        userID,
        matrixData,
        matrixComments
      );
    }
  };

  const getUserId = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    return jwt(refreshToken).userID;
  };

  useEffect(() => {
    (async () => {
      let currentUserID = userID;
      if (!currentUserID) {
        currentUserID = getUserId();
      }
      console.log("MatrixPage currentUserID", currentUserID)
      const savedData = await loadTablesAPI(axiosPrivate, currentUserID);
      console.log("savedData", savedData);
      if (savedData) {
        const loadedMatrix = savedData.matrixesData[0];
        if (loadedMatrix) {
          setMatrixData(JSON.parse(loadedMatrix));
        }
        const commentMatrix = savedData.matrixesData[1];
        if (commentMatrix) {
          setMatrixComments(JSON.parse(commentMatrix));
        }
        setMatrixID(savedData.matrixID);
      }
      const [productsData, customerList, driverList] = await Promise.all([
        getProductsAPI(axiosPrivate, validationModal),
        getCustomersAPI(axiosPrivate),
        getDriverList(axiosPrivate),
      ]);
      setCustomers(customerList);
      const uniqProducts =
        productsData.length > 0 ? getUniqProducts(productsData) : undefined;
      setProducts(uniqProducts);
      setDrivers(driverList);
      const productsMap = getProductsNameKeyMap(uniqProducts);
      setProductsMap(productsMap);
    })();
  }, []);

  useEffect(() => {
    console.log("1234");

    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [matrixData, matrixComments]);

  return drivers?.length ? (
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

export default MatrixPage;
