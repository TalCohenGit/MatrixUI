import React, { useState } from "react";
import { getDriverList } from "../api";

export const DataContext = React.createContext(null);

const DataContextProvider = (props) => {
  const [matrixData, setMatrixData] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isListVisible, toggleList] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [errorMessage, setError] = useState("");
  const [productsMap, setProductsMap] = useState([]);

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
        productsMap,
        setProductsMap
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
