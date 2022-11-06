import React, { useState } from "react";
import { getDriverList } from "../api";

export const DataContext = React.createContext(null);

const DataContextProvider = (props) => {
  const [matrixData, setMatrixData] = useState([]);
  const [matrixComments, setMatrixComments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isListVisible, toggleList] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [errorMessage, setError] = useState("");
  const [balanceTableData, setBalanceTableData] = useState([]);
  const [productsMap, setProductsMap] = useState([]);
  const [products, setProducts] = useState([]);
  const [matrixID, setMatrixID] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [timeLimit, setTimelimit] = useState("");
  const [userID, setUserID] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([])
  const [matrixName, setMatrixName] = useState("")
  const [matrixDate, setMatrixDate] = useState("")
  const [isInitiated, setIsInitiated] = useState(false)
  const [businessName, setBusinessName] = useState("");

  const getNewCustomerData = () => {
    const customerObject = customers.find(
      (customer) => customer.userName === customerName
    );
    if (!customerObject) {
      return null;
    }
    return Object.values(customerObject).map((customerElement) =>
      customerElement ? customerElement : "-"
    );
  };

  return (
    <DataContext.Provider
      value={{
        matrixData,
        setMatrixData,
        drivers,
        setDrivers,
        customers,
        setCustomers,
        isListVisible,
        toggleList,
        customerName,
        setCustomerName,
        getNewCustomerData,
        errorMessage,
        setError,
        balanceTableData,
        setBalanceTableData,
        productsMap,
        setProductsMap,
        matrixComments,
        setMatrixComments,
        products,
        setProducts,
        matrixID,
        setMatrixID,
        accessToken,
        setAccessToken,
        timeLimit,
        setTimelimit,
        userID,
        setUserID,
        selectedProducts,
        setSelectedProducts,
        matrixName,
        setMatrixName,
        matrixDate,
        setMatrixDate,
        isInitiated,
        setIsInitiated,
        businessName,
        setBusinessName
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
