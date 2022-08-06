import React, { useEffect, useContext, useState } from "react";
import "./App.scss";
import "normalize.css";
import AddCustomer from "./components/AddCustomer";
import Table from "./components/Table";
import products from "./mockData/products.json";
import { getCustomersAPI, getProductsAPI, sendTableAPI } from "./api";
import { DataContext } from "./context/DataContext";
import { createBalanceTable, getProductsNameKeyMap } from "./utils/utils";
import CircularProgress from "@mui/material/CircularProgress";
import { numOfColBeforeProducts } from "./utils/constants";

function App() {
  const {
    matrixData,
    setMatrixData,
    handleFetchDrivers,
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
  } = useContext(DataContext);

  const addCustomerToTable = () => {
    try {
      if (matrixData?.length) {
        const productsNumber = matrixData[0].length - numOfColBeforeProducts;
        const currentMatrixData = [...matrixData];
        const newCustomerData = getNewCustomerData();
        if (!newCustomerData) {
          setError("לקוח לא קיים");
        }
        currentMatrixData.push([
          ...newCustomerData,
          ...Array(productsNumber).fill(0),
        ]);
        setMatrixData(currentMatrixData);
        const commentsRow = Array(productsNumber).fill(null);
        const newMatrixComment = [...matrixComments]
        newMatrixComment.push(commentsRow)
        setMatrixComments(newMatrixComment)
      }
      setCustomerName("");
    } catch (e) {
      console.log(e, "addCustomerToTable");
    }
  };

  const addProductToTable = (products) => {
    const currentMatrix = matrixData
    const columnIndxToAdd = currentMatrix[0].length - 5
    const arrayWithColumn = currentMatrix.map((row, rowIndex) => {
        let newArr;
        if (products.length > 0) {
          if(rowIndex == 0) {
            newArr = [...row.slice(0, 3), ...products, ...row.slice(columnIndxToAdd,  currentMatrix[0].length)]
          } else {
            newArr = [...row.slice(0, 3), ...Array(products.length).fill(0), ...row.slice(columnIndxToAdd,  currentMatrix[0].length)]
          }
        } else {
          newArr = [...row.slice(0, 3), ...row.slice(columnIndxToAdd, currentMatrix[0].length)]
        }
        return newArr
      })
    setMatrixData(arrayWithColumn)
  }

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
    (async () => {
      const productsData = await getProductsAPI(products);
      // const currentProducts = [...products]
      const productsNames = productsData.map((element) => element["שם פריט"])
      setProducts(productsNames)
      const currentBalanceData = createBalanceTable(productsData);
      setBalanceTableData(currentBalanceData);
      const productsMap = getProductsNameKeyMap(productsData);
      setProductsMap(productsMap);
      const tableTitle = [
        "שם לקוח",
        "מזהה",
        "טלפון",
        "איסוף",
        "מאושר",
        "סוג מסמך",
        "הערות",
        ""
      ];

      const currentMatrixData = [...matrixData];
      currentMatrixData.push(tableTitle);
      setMatrixData(currentMatrixData);
      const customerList = await getCustomersAPI(productsMap);
      setCustomers(customerList);
      handleFetchDrivers();
    })();
  }, []);

  return matrixData?.length ? (
    <div className="app-container">
      <h1>גת אביגדור קופה רושמת</h1>
      <AddCustomer
        customerName={customerName}
        setCustomerName={setCustomerName}
        addCustomerToTable={addCustomerToTable}
        sendTableAPI={sendTableAPI}
        addProductToTable={addProductToTable}
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
