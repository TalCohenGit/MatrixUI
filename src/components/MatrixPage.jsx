import React, { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import "../App.scss";
import "normalize.css";
import AddCustomer from "../components/AddCustomer";
import Table from "../components/Table";
import {
  getCustomersAPI,
  getProductsAPI,
  saveTablesAPI,
  loadTablesAPI,
  getDriverList,
  logoutAPI,
  refreshTokenAPI,
  getMatrixByIDAPI,
  getTablesByDatesAPI,
} from "../api";
import { DataContext } from "../context/DataContext";
import {
  getProductsNameKeyMap,
  updateBalanceTable,
  removeColFromBalanceTable,
  getUniqProducts,
  getRefreshToken,
  getMatrixesData,
  numOfProducts,
} from "../utils/utils";
import CircularProgress from "@mui/material/CircularProgress";
import {
  numOfColBeforeProducts,
  numOfColAfterProducts,
  dateFormat,
  savingAsAction,
  savingAction
} from "../utils/constants";
import Modal from "../common/components/Modal/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

function MatrixPage({ seconds, setSeconds, setRefreshToken }) {
  const {
    matrixData,
    setMatrixData,
    setCustomers,
    customerName,
    setCustomerName,
    getNewCustomerData,
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
    setUserID,
    matrixID,
    setMatrixID,
    selectedProducts,
    setSelectedProducts,
    productsMap,
    matrixName,
    setMatrixName,
    matrixDate,
    setMatrixDate
  } = useContext(DataContext);

  const [isOpenValidationModal, toggleValidationModal] = useState(false);
  const [validationErrors, setValidationError] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  let interval;
  const getTableTitle = () => {
    const tableTitle = [
      "שם לקוח",
      "מזהה",
      "טלפון",
      "סוג מסמך",
      "איסוף",
      "מאושר",
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
        let newMatrixComment = [...matrixComments];
        const commentsRow = Array(productsNumber).fill(null);
        if (newMatrixComment.length > 0) {
          newMatrixComment.push(commentsRow);
        } else {
          newMatrixComment = [commentsRow];
        }
        setMatrixComments(newMatrixComment);
      }
      setCustomerName("");
    } catch (e) {
      console.log(e, "error in addCustomerToTable");
    }
  };

  const addProducts = (productsToAdd, currentMatrix, numCurrentProducts) => {
    const newMatrixComment = [...matrixComments];
    const matrixWithProduct = currentMatrix.map((row, rowIndex) => {
      let newArr;
      if (rowIndex == 0) {
        newArr = [
          ...row.slice(0, numOfColBeforeProducts + numCurrentProducts),
          ...productsToAdd,
          ...row.slice(
            numOfColBeforeProducts + numCurrentProducts,
            currentMatrix[0].length
          ),
        ];
      } else {
        newArr = [
          ...row.slice(0, numOfColBeforeProducts + numCurrentProducts),
          ...Array(productsToAdd.length).fill(0),
          ...row.slice(
            numOfColBeforeProducts + numCurrentProducts,
            currentMatrix[0].length
          ),
        ];
        if (
          newMatrixComment[rowIndex - 1] &&
          newMatrixComment[rowIndex - 1].length > 0
        ) {
          newMatrixComment[rowIndex - 1].push(
            ...Array(productsToAdd.length).fill(null)
          );
        } else {
          const arrToAdd = Array(productsToAdd.length).fill(null);
          newMatrixComment[rowIndex - 1] = arrToAdd;
        }
      }
      return newArr;
    });
    setMatrixComments(newMatrixComment);
    return matrixWithProduct;
  };

  const removeProduct = (productName, currentMatrix) => {
    let productIndx;
    return currentMatrix.map((row, rowIndex) => {
      let newArr;
      if (rowIndex === 0) {
        productIndx = row.indexOf(productName);
      }
      newArr = [
        ...row.slice(0, productIndx),
        ...row.slice(productIndx + 1, currentMatrix[0].length),
      ];
      const newMatrixComment = [...matrixComments];
      if (newMatrixComment?.length > 0 && rowIndex > 0) {
        newMatrixComment[rowIndex - 1].pop();

        setMatrixComments(newMatrixComment);
      }
      return newArr;
    });
  };

  const removeAllProducts = (currentMatrix, numCurrentProducts) => {
    const newMatrix = currentMatrix.map((row, rowIndex) => {
      let newArr;
      newArr = [
        ...row.slice(0, numOfColBeforeProducts),
        ...row.slice(
          numOfColBeforeProducts + numCurrentProducts,
          currentMatrix[0].length
        ),
      ];
      return newArr;
    });
    setMatrixComments([]);
    return newMatrix;
  };

  const addProductToTable = (selectedProductNames, event) => {
    const currentMatrix = [...matrixData];
    const currentBalanceTable = [...balanceTableData];
    let newBalanceTable = [];
    if (!currentMatrix.length) {
      currentMatrix.push(getTableTitle());
    }
    let newMatrix = currentMatrix;
    const numCurrentProducts = numOfProducts(currentMatrix[0].length);
    if (event.action === "select-option") {
      let productsToAdd = selectedProductNames;
      if (event.option.value === "*") {
        if (numCurrentProducts > 0) {
          const currentProducts = currentMatrix[0].slice(
            numOfColBeforeProducts,
            numOfColBeforeProducts + numCurrentProducts
          );
          productsToAdd = selectedProductNames.filter(
            (product) => !currentProducts.includes(product)
          );
        }
        newMatrix = addProducts(
          productsToAdd,
          currentMatrix,
          numCurrentProducts
        );
        newBalanceTable = updateBalanceTable(
          currentBalanceTable,
          productsToAdd,
          products,
          numCurrentProducts
        );
      } else {
        newMatrix = addProducts(
          [event.option.value],
          currentMatrix,
          numCurrentProducts
        );
        newBalanceTable = updateBalanceTable(
          currentBalanceTable,
          [event.option.value],
          products,
          numCurrentProducts
        );
      }
    } else if (event.action === "deselect-option") {
      if (event.option.value === "*") {
        newMatrix = removeAllProducts(currentMatrix, numCurrentProducts);
      } else {
        newMatrix = removeProduct(event.option.value, currentMatrix);
        newBalanceTable = removeColFromBalanceTable(
          currentBalanceTable,
          products,
          event.option.value
        );
      }
    }
    setMatrixData(newMatrix);
    setBalanceTableData(newBalanceTable);
  };

  const validationModal = (validationErrors) => {
    if (validationErrors?.length > 0) {
      setValidationError(validationErrors);
      toggleValidationModal(true);
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
    // interval = setInterval(() => {
    //   setSeconds((prevSeconds) => prevSeconds + 1);
    // }, 1000);
    // return () => {
    //   clearInterval(interval);
    // };
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
  }, []);

  useEffect(() => {
    setSeconds(0);
  }, [matrixData]);

  useEffect(() => {
    (async () => {
      if (!accessToken) {
        const refreshToken = getRefreshToken();
        const { accessToken } = await refreshTokenAPI(refreshToken);
        setAccessToken(accessToken);
      }
    })();
  }, []);

  const getUserId = () => {
    let currentUserID = userID;
    if (!currentUserID) {
      const refreshToken = getRefreshToken();
      currentUserID = jwt(refreshToken).userID;
      setUserID(currentUserID);
    }
    return currentUserID;
  };

  const saveTables = async (isBI, action) => {
    let date = null;
    if (matrixDate) {
      console.log("matrixDate", matrixDate)
      date = format(new Date(matrixDate), "MM/dd/yyyy");
    }
    const {
      newMatrixId,
      validatedData,
      cellsData,
      docCommentsToSend,
      metaDataToSend,
    } = await getMatrixesData(
      axiosPrivate,
      matrixData,
      productsMap,
      matrixComments,
      matrixID,
      action
    );
    
    if(action === savingAsAction) {
      setMatrixID(newMatrixId)
    }
  
    const matrixesUiData = JSON.stringify([
      matrixData,
      matrixComments,
      selectedProducts,
      balanceTableData,
    ]);
    localStorage.setItem("matrixesUiData", JSON.stringify(matrixesUiData));

    await saveTablesAPI(
      axiosPrivate,
      newMatrixId,
      validatedData,
      matrixesUiData,
      cellsData,
      docCommentsToSend,
      metaDataToSend,
      isBI,
      date,
      matrixName,
      productsMap
    );
  };

  const loadTables = async (matrixID) => {
    const {matrixesUiData, isProduced, matrixName, date} = await getMatrixByIDAPI(axiosPrivate, matrixID);
    if (matrixesUiData) {
      loadData(matrixesUiData, setMatrixData, 0);
      loadData(matrixesUiData, setMatrixComments, 1);
      loadData(matrixesUiData, setSelectedProducts, 2);
      loadData(matrixesUiData, setBalanceTableData, 3);
    }
    setMatrixID(matrixID);
    setMatrixName(matrixName);
  };

  const onUnload = async (e) => {
    const isBI = false;
    let action = savingAction
    if(matrixID) {
      action = savingAsAction
    }
    await saveTables(isBI, action);
  };

  const loadData = (matrixesUiData, stateToChange, index) => {
    if (matrixesUiData) {
      const loadedMatrix = matrixesUiData[index];
      if (loadedMatrix) {
        stateToChange(loadedMatrix);
        // stateToChange([]);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const currentUserID = getUserId();
      const savedData = await loadTablesAPI(axiosPrivate, currentUserID);
      if (savedData) {
        const matrixesUiData = savedData.matrixesUiData;
        loadData(matrixesUiData, setMatrixData, 0);
        loadData(matrixesUiData, setMatrixComments, 1);
        loadData(matrixesUiData, setSelectedProducts, 2);
        loadData(matrixesUiData, setBalanceTableData, 3);
        setMatrixID(savedData.matrixID);
        setMatrixName(savedData.matrixName)
        setMatrixDate(savedData.matrixDate)
      }
      const [productsData, customerList, driverList] = await Promise.all([
        getProductsAPI(axiosPrivate, validationModal),
        getCustomersAPI(axiosPrivate),
        getDriverList(axiosPrivate),
      ]);
      setCustomers(customerList);
      const uniqProducts =
        productsData?.length > 0 ? getUniqProducts(productsData) : undefined;
      setProducts(uniqProducts);
      setDrivers(driverList);
      const productsMap = uniqProducts
        ? getProductsNameKeyMap(uniqProducts)
        : undefined;
      setProductsMap(productsMap);
    })();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [matrixData, matrixComments]);

  return drivers?.length ? (
    <div className="matrix-page">
      <h1> MatrixUi </h1>
      <Modal
        isOpen={isOpenValidationModal}
        toggleModal={toggleValidationModal}
        modalHeader={"נא לטפל בכפילויות של הנתונים"}
      >
        <div>{dataDoubles}</div>
        <div className="action-buttons">
          <button
            className="cancel-button"
            onClick={() => toggleValidationModal(false)}
          >
            בטל
          </button>
        </div>
      </Modal>
      <AddCustomer
        customerName={customerName}
        setCustomerName={setCustomerName}
        addCustomerToTable={addCustomerToTable}
        addProductToTable={addProductToTable}
        axiosPrivate={axiosPrivate}
        userID={userID}
        saveTables={saveTables}
        loadTables={loadTables}
        matrixName={matrixName}
        setMatrixName={setMatrixName}
        matrixDate={matrixDate}
        setMatrixDate={setMatrixDate}
      />

      <Table
        data={matrixData}
        setData={setMatrixData}
        tableName="main"
        cb={calcProductsSum}
        bgColor="#F5FFFA"
      />
      <Table
        data={balanceTableData}
        setData={setBalanceTableData}
        tableName="balance"
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
