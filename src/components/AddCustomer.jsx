import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";
import { handleMatrixData, handleCommentMatrixData } from "../utils/utils";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { getMatrixIDAPI, getUrlsAPI, sendTableAPI } from "../api";
import Modal from "../common/components/Modal/Modal";
import DatePicker from "./DatePicker"


const AddCustomer = ({
  customerName,
  setCustomerName,
  addCustomerToTable,
  addProductToTable,
  axiosPrivate,
  userID,
  saveTables
}) => {
  const {
    toggleList,
    errorMessage,
    setError,
    matrixData,
    productsMap,
    matrixComments,
    products,
    matrixID,
    selectedProducts,
    setSelectedProducts,
  } = useContext(DataContext);
  const [customerValidationFailed, setCustomerValidationFailed] = useState("");
  const [isOpen, toggleModal] = useState(false)
  const [producedUrls, setProducedUrls] = useState("")
  const [disableProduction, setDisableProduction] = useState(false)
  const [toSaveDataModal, toggleToSaveDataModal] = useState(false)
  const [dateValue, setDateValue] = useState("");

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
      setSelectedProducts(options);
      selectedValues = productsOptions.map((element) => element.value);
    } else if (
      event.action === "deselect-option" &&
      event.option.value === "*"
    ) {
      setSelectedProducts([]);
    } else if (event.action === "deselect-option") {
      const values = value.filter((o) => o.value !== "*");
      setSelectedProducts(values);
      selectedValues = values.map((element) => element.value);
    } else {
      setSelectedProducts(value);
      selectedValues = value.map((element) => element.value);
    }
    addProductToTable(selectedValues, event);
  };

  const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
    if (value) {
      if (value.some((o) => o.value === "*")) {
        return `${placeholderButtonLabel}: הכל`;
      } else {
        return `${placeholderButtonLabel}: ${value.length} נבחרו`;
      }
    } else {
      return `${placeholderButtonLabel}: 0 נבחרו`
    }
  };

  const produceDoc = async (
    productsMap,
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
    const {cellsData, docCommentsToSend, metaDataToSend} = handleCommentMatrixData(
      matrixComments,
      validatedData["docComments"],
      validatedData["metaData"]
    );
    let newMatrixId = matrixID
    if (!newMatrixId) {
      newMatrixId = await getMatrixIDAPI(axiosPrivate);
    }
    try{
      setDisableProduction(true)
      const sendTableRes = await sendTableAPI(axiosPrivate, validatedData, newMatrixId, cellsData, docCommentsToSend, metaDataToSend)
      console.log("sendTableRes", sendTableRes)
      const urls = await getUrlsAPI(axiosPrivate, userID)
      setProducedUrls(urls)
      toggleModal(true)
      setDisableProduction(false)
    }catch(e) {
      console.log("error in produceDoc:", e)
    }
  };

  const getUrls = producedUrls && producedUrls.map((url) => {
    return (
      <div>
      <a href={url}>{url}</a><br/>
      </div>
    );
  });

  const saveData = () => {
    toggleToSaveDataModal(true)
  }

  const handleSaving = async() => {
    const isBI = true;
    await saveTables(isBI, dateValue)
    toggleToSaveDataModal(false)
  }

  const customStyles = {
    option: () => ({
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems:'center'
    })
  }


  return (
    <>
      <div className="addCustomer-wrapper">
        <div className="addCustomer-input-wrapper">
        <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader="מסמכים שהופקו">
          <div>{getUrls}</div>
          <div className="action-buttons">
          <button className="cancel-button" onClick={() => toggleModal(false)}>
            בטל
          </button>
        </div>
        </Modal>
        <Modal isOpen={toSaveDataModal} toggleModal={toggleToSaveDataModal} modalHeader="בחר תאריך להפקת המסמכים">
          <div>
          <DatePicker dateValue={dateValue} setDateValue={setDateValue}/>
          </div>
          <div className="action-buttons">
          <button className="cancel-button" onClick={() => handleSaving()}>
            שמירת טבלה
          </button>
          <button className="cancel-button" onClick={() => toggleToSaveDataModal(false)}>
            בטל
          </button>
        </div>
        </Modal>
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
          הוספת לקוח
        </button>
        <div className="chooseProduct">
          <ReactMultiSelectCheckboxes
            options={options}
            onChange={handleProductsSelect}
            placeholderButtonLabel="מוצרים"
            getDropdownButtonLabel={getDropdownButtonLabel}
            value={selectedProducts}
            placeholder={"חיפוש"}
            setState={setSelectedProducts}
            styles={customStyles}
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
          className="save-tables"
          disabled={matrixData.length === 0}
          onClick={() =>
            saveData()
          }
        >
          שמירה
        </button>
        <button
          className="createInvoice-button"
          disabled={matrixData.length === 0 || disableProduction}
          onClick={() =>
            produceDoc(productsMap)
          }
        >
          הפקת חשבונית
        </button>
      </div>
      {errorMessage?.length ? (
        <p className="error-message">{errorMessage}</p>
      ) : null}
    </>
  );
};

export default AddCustomer;
