import React, { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import "../App.scss";
import "normalize.css";
import AddCustomer from "../components/AddCustomer";
import Table from "../components/Table";
import CopyDataModal from "../components/Modals/CopyDataModal";
import Logout from "../components/Logout";
import SaveModal from "./SaveModal/SaveModal";
import {
  getCustomersAPI,
  getProductsAPI,
  saveTablesAPI,
  loadTablesAPI,
  getDriversAPI,
  refreshTokenAPI,
  getMatrixByIDAPI,
  getTablesByDatesAPI,
  getMatrixIDAPI,
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
  loadAllMatrixesData,
  loadData,
  removeProductCol,
  formatDateWhenSaving,
  logout,
  getUserEmail,
} from "../utils/utils";
import CircularProgress from "@mui/material/CircularProgress";
import {
  numOfColBeforeProducts,
  numOfColAfterProducts,
  savingAsAction,
  savingAction,
  copyMatrixAction,
} from "../utils/constants";
import Modal from "../common/components/Modal/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "./ProgressBar/ProgressBar";

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
    setMatrixDate,
    setIsInitiated,
    isInitiated,
    calcProductsSum,
    isInProgress,
    progressValue,
  } = useContext(DataContext);

  const [isOpenValidationModal, toggleValidationModal] = useState(false);
  const [validationErrors, setValidationError] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [toCopyDataModal, toggleToCopyDataModal] = useState(false);
  const [dataToLoad, setDataToLoad] = useState({
    matrixName: "",
    date: "",
    matrixesUiData: [],
    isBI: true,
  });
  const [missingProductCol, setMissingProductsCol] = useState(0);
  const [detailsToCopyModal, toggleDetailsToCopyModal] = useState(false);

  let interval;
  const getTableTitle = () => {
    const tableTitle = [
      "שם לקוח",
      "מזהה",
      "טלפון",
      "סוג מסמך",
      "איסוף",
      "מאושר",
      "מידע למסמך",
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
        console.log("addCustomerToTable newMatrixComment", newMatrixComment);
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
    console.log("addProducts matrixWithProduct", matrixWithProduct);
    console.log("addProducts newMatrixComment", newMatrixComment);
    setMatrixComments(newMatrixComment);
    return matrixWithProduct;
  };

  const removeProduct = (productName, currentMatrix) => {
    const firstRow = currentMatrix[0];
    const productIndx = firstRow.indexOf(productName);
    const currentMatrixComments = [...matrixComments];
    return removeProductCol(productIndx, currentMatrix, currentMatrixComments);
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

  const handleProducts = (selectedProductNames, event) => {
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
        const { newMatrixData, newMatrixComments } = removeProduct(
          event.option.value,
          currentMatrix
        );
        newMatrix = newMatrixData;
        setMatrixComments(newMatrixComments);
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

  useEffect(() => {
    // interval = setInterval(() => {
    //   setSeconds((prevSeconds) => prevSeconds + 1);
    // }, 1000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [accessToken]);

  // useEffect(() => {
  //   (async () => {
  //     let currentTimeLimit = timeLimit;
  //     if (!currentTimeLimit) {
  //       currentTimeLimit = localStorage.getItem("timeLimit");
  //       setTimelimit(timeLimit);
  //     }
  //     if (currentTimeLimit && seconds > currentTimeLimit) {
  //       clearInterval(interval);
  //       await logout(setAccessToken, setRefreshToken)
  //     }
  //   })();
  // }, []);

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

  const getMatrixFormatedDate = (matrixDate) => {
    if (matrixDate) {
      return formatDateWhenSaving(matrixDate);
    }
  };

  const getMatrixID = async (action) => {
    let newMatrixId = matrixID;
    if (
      (action === savingAsAction && isInitiated) ||
      action === copyMatrixAction || !newMatrixId ||
      (action === savingAction && !isInitiated)
    ) {
      newMatrixId = await getMatrixIDAPI(axiosPrivate);
      setMatrixID(newMatrixId);
    }

    return newMatrixId;
  };

  const saveTables = async (
    matrixDate,
    isBI,
    action,
    newIsInitiated,
    newMatrixName
  ) => {
    const date = getMatrixFormatedDate(matrixDate);
    const newMatrixId = await getMatrixID(action);
    localStorage.setItem("newMatrixId", newMatrixId)

    const { validatedData, cellsData, docCommentsToSend, metaDataToSend } =
      await getMatrixesData(
        matrixData,
        productsMap,
        matrixComments,
        matrixID,
        action
      );

    const matrixesUiData = JSON.stringify([
      matrixData,
      matrixComments,
      selectedProducts,
      balanceTableData,
    ]);

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
      newMatrixName,
      productsMap,
      newIsInitiated
    );
    return newMatrixId
  };

  const setMatrixesDetails = (matrixID, matrixName, matrixDate) => {
    setMatrixID(matrixID);
    setMatrixName(matrixName);
    setMatrixDate(matrixDate);
  };

  const cancelCopyModal = () => {
    toggleToCopyDataModal(false);
  };

  const handleCopy = () => {
    toggleToCopyDataModal(false);
    toggleDetailsToCopyModal(true);
  };

  const copyMatrix = async (action, toggleModal, isBi, newMatrixName, dateValue) => {
    try {
      loadAllMatrixesData(dataToLoad["matrixesUiData"], [
        setMatrixData,
        setMatrixComments,
        setSelectedProducts,
        setBalanceTableData,
      ]);

      const newIsInitiated = false
      const newMatrixID = await saveTables(
        dateValue,
        isBi,
        copyMatrixAction,
        newIsInitiated,
        newMatrixName
      );

      setIsInitiated(false);
      setMatrixesDetails(
        newMatrixID,
        newMatrixName,
        dateValue
      );
      toggleModal(false);
    } catch (e) {
      console.log("copyMatrix: failed to copy ", e);
      toggleDetailsToCopyModal(false);
    }
  };

  const loadTables = async (matrixID) => {
    const { matrixesUiData, isProduced, matrixName, date, isBI } =
      await getMatrixByIDAPI(axiosPrivate, matrixID);
    if (isProduced) {
      toggleToCopyDataModal(true);
      setDataToLoad({ matrixName, date, matrixesUiData, isBI });
    } else {
      loadAllMatrixesData(matrixesUiData, [
        setMatrixData,
        setMatrixComments,
        setSelectedProducts,
        setBalanceTableData,
      ]);
      setMatrixesDetails(matrixID, matrixName, date);
    }
    return { matrixName, date, matrixesUiData };
  };

  const onUnload = async (ev) => {
    const isBI = false;
    let action = savingAction;
    if (!isInitiated) {
      action = savingAsAction;
    }
    localStorage.setItem("action", action)
    localStorage.setItem("isInitiated", isInitiated)

    const newIsInitiated = isInitiated;
    await saveTables(matrixDate, isBI, action, newIsInitiated, matrixName);
    // ev.preventDefault();
    // return ev.returnValue = 'Do you want to save data before close?';
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
        setMatrixName(savedData.matrixName);
        setMatrixDate(savedData.matrixDate);
        setIsInitiated(savedData.isInitiated);
      }
      const [productsData, customerList, driverList] = await Promise.all([
        getProductsAPI(axiosPrivate, validationModal),
        getCustomersAPI(axiosPrivate),
        getDriversAPI(),
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
      <h1 className="login-details">שלום {getUserEmail()}</h1>
      <Logout
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
      />
      {/* <ProgressBar /> */}
      <h1> MatrixUi </h1>
      <h2> שם המטריצה: {matrixName}</h2>
      <h3>
        {" "}
        תאריך ערך למטריצה:{" "}
        {matrixDate && new Date(matrixDate).toLocaleDateString()}
      </h3>
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
      <CopyDataModal
        isOpen={toCopyDataModal}
        toggleModal={toggleToCopyDataModal}
        onCancel={cancelCopyModal}
        onCopy={handleCopy}
      />
      <SaveModal
        isOpen={detailsToCopyModal}
        toggleModal={toggleDetailsToCopyModal}
        handleAction={copyMatrix}
        action={copyMatrixAction}
      />
      
      <AddCustomer
        customerName={customerName}
        setCustomerName={setCustomerName}
        addCustomerToTable={addCustomerToTable}
        handleProducts={handleProducts}
        axiosPrivate={axiosPrivate}
        userID={userID}
        saveTables={saveTables}
        loadTables={loadTables}
        matrixName={matrixName}
        setMatrixName={setMatrixName}
        matrixDate={matrixDate}
        setMatrixDate={setMatrixDate}
        copyMatrix={copyMatrix}
      />
<ProgressBar isInProgress={isInProgress} progressValue={progressValue}/>
      <Table
        data={matrixData}
        setData={setMatrixData}
        tableName="main"
        cb={calcProductsSum}
        bgColor="#F5FFFA"
        missingProductsCol={missingProductCol}
      />
      <Table
        data={balanceTableData}
        setData={setBalanceTableData}
        tableName="balance"
        disabled
        bgColor="#F0FFFF"
        missingProductsCol={missingProductCol}
        cb={calcProductsSum}
      />
    </div>
  ) : (
    <div className="loader">
      <CircularProgress />
    </div>
  );
}

export default MatrixPage;
