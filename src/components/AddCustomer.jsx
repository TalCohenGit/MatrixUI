import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";
import { handleMatrixData, handleCommentMatrixData } from "../utils/utils";
import { getMatrixIDAPI } from "../api";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const AddCustomer = ({
  customerName,
  setCustomerName,
  addCustomerToTable,
  sendTableAPI,
  addProductToTable,
}) => {
  const {
    toggleList,
    errorMessage,
    setError,
    matrixData,
    productsMap,
    matrixComments,
    products,
  } = useContext(DataContext);
  const [customerValidationFailed, setCustomerValidationFailed] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const productsOptions = [];
  products.forEach((element) => {
    productsOptions.push({
      value: element["שם פריט"],
      label: element["שם פריט"],
    });
  });
  const options = [{ value: "*", label: "הכל" }, ...productsOptions];

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

  const handleProductsSelect = (value, event) => {
    let selectedValues = [];
    if (event.action === "select-option" && event.option.value === "*") {
      setSelectedOptions(options);
      selectedValues = productsOptions.map((element) => element.value);
    } else if (
      event.action === "deselect-option" &&
      event.option.value === "*"
    ) {
      setSelectedOptions([]);
    } else if (event.action === "deselect-option") {
      const values = value.filter((o) => o.value !== "*");
      setSelectedOptions(values);
      selectedValues = values.map((element) => element.value);
    } else {
      setSelectedOptions(value);
      selectedValues = value.map((element) => element.value);
    }
    addProductToTable(selectedValues);
  };

  const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
    if (value && value.some((o) => o.value === "*")) {
      return `${placeholderButtonLabel}: הכל`;
    } else {
      return `${placeholderButtonLabel}: ${value.length} נבחרו`;
    }
  };

  const produceDoc = async (
    matrixData,
    productsMap,
    matrixComments,
    sendTableAPI
  ) => {
    if (matrixData.length <= 1) {
      return;
    }
    const validatedData = handleMatrixData(
      matrixData,
      productsMap,
      setCustomerValidationFailed
    );
    if (!validatedData) {
      return;
    }
    setCustomerValidationFailed("");
    const matrixID = await getMatrixIDAPI();
    const commentMatrixData = handleCommentMatrixData(
      matrixComments,
      validatedData["docComments"]
    );
    sendTableAPI(validatedData, matrixID, commentMatrixData);
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
        <div className="chooseProduct">
          <ReactMultiSelectCheckboxes
            options={options}
            onChange={handleProductsSelect}
            placeholderButtonLabel="מוצרים"
            getDropdownButtonLabel={getDropdownButtonLabel}
            value={selectedOptions}
            placeholder={"חפש.."}
            setState={setSelectedOptions}
          />
        </div>
        {customerValidationFailed ? (
          <p className="validationComment">
            {" "}
            הפקת חשבונית לא בוצעה! חסרות שדות עבור הלקוח{" "}
            {customerValidationFailed}
          </p>
        ) : null}
        <button
          className="createInvoice-button"
          onClick={() =>
            produceDoc(matrixData, productsMap, matrixComments, sendTableAPI)
          }
        >
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
