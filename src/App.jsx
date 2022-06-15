import { useEffect, useState, useContext } from "react";
import "./App.scss";
import AddCustomer from "./components/AddCustomer";
import Table from "./components/Table"
import products from "./mockData/products.json";
import { getCustomerDetailsAPI, getProductsAPI } from "./api";
import { DataContext } from "./context/DataContext";

function App() {
  const [customerName, setCustomerName] = useState("");
  const {matrixData, setMatrixData, handleFetchDrivers}  = useContext(DataContext)

  const addCustomerToTable = () => {
    try {
      const res = getCustomerDetailsAPI(customerName);
      if (matrixData?.length) {
        const productsNumber = matrixData[0].length - 3;
        const currentMatrixData = [...matrixData];
        currentMatrixData.push([
          ...Object.keys(res).map((customer) => res[customer]),
          ...Array(productsNumber).fill(0),
        ]);
        setMatrixData(currentMatrixData);
    }
    setCustomerName("")
  } catch(e) {
    console.log(e, "addCustomerToTable")
  }
  };

  useEffect(() => {
    const rawProducts = getProductsAPI(products);
    handleFetchDrivers()
    rawProducts.push("איסוף", "מאושר")
    const currentMatrixData = [...matrixData];
    currentMatrixData.push(rawProducts);
    setMatrixData(currentMatrixData);
  }, []);

  return (
    <div className="app-container">
      <h1>גת אביגדור קופה רושמת</h1>
      <AddCustomer
        customerName={customerName}
        setCustomerName={setCustomerName}
        addCustomerToTable={addCustomerToTable}
      />
      <Table/>
    </div>
  );
}

export default App;
