import React, { useEffect, useContext } from "react";
import "./App.scss";
import "normalize.css";
import AddCustomer from "./components/AddCustomer";
import Table from "./components/Table";
import products from "./mockData/products.json";
import { getCustomersAPI, getProductsAPI } from "./api";
import { DataContext } from "./context/DataContext";
import { createBalanceTable } from "./utils/utils";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const {
    matrixData,
    setMatrixData,
    handleFetchDrivers,
    customers,
    setCustomers,
    customerName,
    setCustomerName,
    getNewCustomerData,
    setError,
    setProductsMap,
    productsMap,
  } = useContext(DataContext);

  const addCustomerToTable = () => {
    try {
      if (matrixData?.length) {
        const productsNumber = matrixData[0].length - 3;
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
      }
      setCustomerName("");
    } catch (e) {
      console.log(e, "addCustomerToTable");
    }
  };

  const calcProductsSum = (n) => {
    let sum = 0;
    matrixData.forEach((rowData, rowDataIndex) => {
      if (rowDataIndex === 0) {
        return;
      }
      sum += Number(rowData[n]);
    });
    const currentData = [... productsMap]
    currentData[2][n] = sum;
    currentData[3][n] = currentData[1][n] - sum
    setProductsMap(currentData) 
  };

  useEffect(() => {
    (async () => {
      const productsData = await getProductsAPI(products);
      const currentBalanceData = createBalanceTable(productsData);
      setProductsMap(currentBalanceData);
      console.log("productsData", productsData);
      const tableTitle = [
        "שם לקוח",
        "מזהה",
        "טלפון",
        ...productsData.map((element) => element["שם פריט"]),
        "איסוף",
        "מאושר",
      ];

      const currentMatrixData = [...matrixData];
      currentMatrixData.push(tableTitle);
      setMatrixData(currentMatrixData);
      const customerList = await getCustomersAPI();
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
      />

      <Table
        data={matrixData}
        setData={setMatrixData}
        tableName="matrix"
        cb={calcProductsSum}
      />
      <Table
        data={productsMap}
        setData={setProductsMap}
        tableName="prototype"
        disabled
      />
    </div>
  ) : (
    <div className="loader">
      <CircularProgress />
    </div>
  );
}

export default App;
