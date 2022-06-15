import React, { useState } from "react";
import { getDriverList } from "../api";

export const DataContext = React.createContext(null);

const DataContextProvider = (props) => {
  const [matrixData, setMatrixData] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const handleFetchDrivers = async () => {
    const drivers = await getDriverList();
    setDrivers(drivers);
  };



  return (
    <DataContext.Provider value={{ matrixData, setMatrixData, drivers, handleFetchDrivers }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
