import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";

const AddCustomer = ({ customerName, setCustomerName, addCustomerToTable, sendTableAPI }) => {
  const { toggleList, errorMessage, setError, matrixData } = useContext(DataContext);
  const handleChange = (value) => {
    setCustomerName(value);
    if (errorMessage?.length) {
      setError("");
    }
    if (value.length) {
      toggleList(true);
      return;
    }
    toggleList(false);
  };
  return (
    <>
      <div className="addCustomer-wrapper">
       
        <div className="addCustomer-input-wrapper">
          <input
            type="text"
            value={customerName}
            placeholder={"הזן שם לקוח"}
            onChange={(e) => handleChange(e.target.value)}
            dir="rtl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addCustomerToTable();
              }
            }}
          />
          <SearchList />
        </div>
        <button className="addCustomer-button" onClick={addCustomerToTable}>
         הוסף
        </button>
        <button className="createInvoice-button" onClick={() => sendTableAPI(matrixData)}>
          הפק חשבונית
        </button>
      </div>
      {errorMessage?.length ? (
        <p className="error-message">{errorMessage}</p>
      ) : null}
    </>
  );
};

export default AddCustomer;
