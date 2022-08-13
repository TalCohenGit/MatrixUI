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
  const [productsMap, setProductsMap] = useState([])
  const [products, setProducts] = useState([])
  const [matrixID, setMetrixID] = useState("")
  
  const handleFetchDrivers = async () => {
    const drivers = await getDriverList();
    setDrivers(drivers);
  };

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
        handleFetchDrivers,
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
        setMetrixID
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
