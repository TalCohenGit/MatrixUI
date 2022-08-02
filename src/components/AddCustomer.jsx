import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";
import { handleMatrixData, handleCommentMatrixData } from "../utils/utils"
import { getMatrixIDAPI } from "../api"

const AddCustomer = ({ customerName, setCustomerName, addCustomerToTable, sendTableAPI }) => {
  const { toggleList, errorMessage, setError, matrixData, productsMap, matrixComments } = useContext(DataContext);
  const [customerValidationFailed, setCustomerValidationFailed] = useState("")

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

  const produceDoc = async(matrixData, productsMap, matrixComments, sendTableAPI) => {
    if (matrixData.length <= 1) {
      return
    }
    const validatedData = handleMatrixData(matrixData, productsMap, setCustomerValidationFailed)
    if(!validatedData){
      return
    }
    setCustomerValidationFailed("")
    const matrixID = await getMatrixIDAPI();
    const commentMatrixData = handleCommentMatrixData(matrixComments, validatedData["docComments"])
    sendTableAPI(validatedData, matrixID, commentMatrixData)
  }

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
        {customerValidationFailed ? <p className="validationComment"> הפקת חשבונית לא בוצעה! חסרות שדות עבור הלקוח {customerValidationFailed}</p> : null}
        <button className="createInvoice-button" onClick={() => produceDoc(matrixData, productsMap, matrixComments, sendTableAPI)}>
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
