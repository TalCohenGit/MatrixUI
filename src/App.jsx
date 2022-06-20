import { useEffect, useState, useContext } from "react";
import "./App.scss";
import 'normalize.css';
import AddCustomer from "./components/AddCustomer";
import Table from "./components/Table";
import products from "./mockData/products.json";
import { getCustomersAPI, getProductsAPI } from "./api";
import { DataContext } from "./context/DataContext";

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
    setError
  } = useContext(DataContext);

  const addCustomerToTable = () => {
    try {
      if (matrixData?.length) {
        const productsNumber = matrixData[0].length - 3;
        const currentMatrixData = [...matrixData];
        const newCustomerData = getNewCustomerData()
        if(!newCustomerData){
          setError("לקוח לא קיים")
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

  useEffect(() => {
    (async () => {
      const productData = await getProductsAPI(products);
      const tableTitle = productData.map((element) => element["שם פריט"])
      tableTitle.push("איסוף", "מאושר");
      const currentMatrixData = [...matrixData];
      currentMatrixData.push(tableTitle);
      setMatrixData(currentMatrixData);
      const customerList = await getCustomersAPI();
      setCustomers(customerList);
      handleFetchDrivers();
    })();
  }, []);

  return (
    <div className="app-container">
      <h1>גת אביגדור קופה רושמת</h1>
      <AddCustomer
        customerName={customerName}
        setCustomerName={setCustomerName}
        addCustomerToTable={addCustomerToTable}
      />
      <Table />
    </div>
  );
}

export default App;
