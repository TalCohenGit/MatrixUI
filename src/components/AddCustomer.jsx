import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";
import { handleMatrixData, handleCommentMatrixData } from "../utils/utils";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import {
  getMatrixIDAPI,
  getUrlsAPI,
  sendTableAPI,
  loadTablesByDatesAPI,
} from "../api";
import Modal from "../common/components/Modal/Modal";
import DropDownMatrixNames from "../components/DropDownMatrixNames";
import DatePicker from "./DatePicker";
import DateRangePickerToLoad from "./DateRangePickerToLoad";
import { addDays } from "date-fns";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

const AddCustomer = ({
  customerName,
  setCustomerName,
  addCustomerToTable,
  addProductToTable,
  axiosPrivate,
  userID,
  saveTables,
  loadTables,
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
  const [customerValidationFailed, setCustomerValidationFailed] = useState({
    failure: false,
    error: "",
  });
  const [isUrlsModalOpen, toggleUrlsModal] = useState(false);
  const [producedUrls, setProducedUrls] = useState("");
  const [disableProduction, setDisableProduction] = useState(false);
  const [toSaveDataModal, toggleToSaveDataModal] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [savedMatrixName, setSavedMatrixName] = useState("");
  const [toLoadDataModal, toggleToLoadDataModal] = useState(false);
  const [isMatrixNames, toggleMatrixNames] = useState(false);
  const [matrixesDetails, setMatrixesDetails] = useState([]);
  const intialRangeState = [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ];
  const [dateRanges, setDateRanges] = useState(intialRangeState);

  const productsOptions = [];

  products &&
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
      return `${placeholderButtonLabel}: 0 נבחרו`;
    }
  };

  const produceDoc = async (productsMap) => {
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
    const { cellsData, docCommentsToSend, metaDataToSend } =
      handleCommentMatrixData(
        matrixComments,
        validatedData["docComments"],
        validatedData["metaData"]
      );
    let newMatrixId = matrixID;
    if (!newMatrixId) {
      newMatrixId = await getMatrixIDAPI(axiosPrivate);
    }
    try {
      setDisableProduction(true);
      const sendTableRes = await sendTableAPI(
        axiosPrivate,
        validatedData,
        newMatrixId,
        cellsData,
        docCommentsToSend,
        metaDataToSend
      );
      // console.log("sendTableRes", sendTableRes);
      const urls = await getUrlsAPI(axiosPrivate, userID);
      setProducedUrls(urls);
      toggleUrlsModal(true);
      setDisableProduction(false);
    } catch (e) {
      console.log("error in produceDoc:", e);
    }
  };

  const getUrls =
    producedUrls &&
    producedUrls.map((url) => {
      return (
        <div>
          <a href={url}>{url}</a>
          <br />
        </div>
      );
    });

  const saveData = () => {
    toggleToSaveDataModal(true);
  };

  const loadData = () => {
    toggleToLoadDataModal(true);
  };

  const handleSaving = async () => {
    const isBI = true;
    await saveTables(isBI, dateValue, savedMatrixName);
    cancleSave();
  };

  const formatDate = (dateValue) => {
    if (dateValue) {
      return dateValue.toLocaleDateString("en-us");
    }
  };

  const loadTableNames = async () => {
    const startDate = formatDate(dateRanges[0]["startDate"]);
    const endDate = formatDate(dateRanges[0]["endDate"]);
    const matrixesDetails = await loadTablesByDatesAPI(
      axiosPrivate,
      startDate,
      endDate
    );
    if (matrixesDetails?.length) {
      setMatrixesDetails(matrixesDetails);
      toggleMatrixNames(true);
    } else {
      console.log("error in loadTableNames - getting matrixDetails");
    }
  };

  const loadTablesByID = async (matrixID) => {
    await loadTables(matrixID);
    cancleLoading();
  };

  const cancleSave = () => {
    toggleToSaveDataModal(false);
    setDateValue("");
  };

  const saveModal = (isOpen, toggleModal, handleAction, action) => {
    return (
      <Modal
        isOpen={isOpen}
        toggleModal={cancleSave}
        modalHeader="פרטים לשמירה"
      >
        <div>
          <label>שם</label>
          <input
            type="text"
            id="matrixName"
            onChange={(e) => setSavedMatrixName(e.target.value)}
          />
          <p>תאריך לשמירה</p>
          <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
        </div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={() => handleAction()}>
            {action}
          </button>
          <button className="cancel-button" onClick={() => cancleSave()}>
            בטל
          </button>
        </div>
      </Modal>
    );
  };

  const cancleLoading = () => {
    toggleToLoadDataModal(false);
    toggleMatrixNames(false);
    setMatrixesDetails([]);
    setDateRanges(intialRangeState);
  };

  const loadModal = (toLoadDataModal) => {
    return (
      <Modal
        isOpen={toLoadDataModal}
        toggleModal={cancleLoading}
        modalHeader="טעינה"
      >
        <div>
          <p>בחירת טווח תאריכים</p>
          <DateRangePickerToLoad
            dateRanges={dateRanges}
            setDateRanges={setDateRanges}
          />
          {/* <DatePicker dateValue={toDateValue} setDateValue={setToDateValue} /> */}
        </div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={() => loadTableNames()}>
            חיפוש
          </button>
          <button className="cancel-button" onClick={() => cancleLoading()}>
            בטל
          </button>
        </div>
        {isMatrixNames && (
          <DropDownMatrixNames
            matrixesDetails={matrixesDetails}
            loadTablesByID={loadTablesByID}
          />
        )}
      </Modal>
    );
  };

  const listModal = (isOpen, toggleModal, header, dataToShow) => {
    return (
      <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={header}>
        <div>{dataToShow}</div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={() => toggleModal(false)}>
            בטל
          </button>
        </div>
      </Modal>
    );
  };

  const customStyles = {
    option: () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px",
      marginLeft:"10px",
      marginRight:"10px",
      "&:hover" : {
        backgroundColor:"#d3d3d3",
        cursor:"pointer"
      }
    }),
    menu: () => ({
     direction:"ltr",
    }),
    input: () => ({
      fontSize:"40px"
    })
   

  };

  return (
    <>
      <div className="addCustomer-wrapper">
        <div className="addCustomer-input-wrapper">
          {listModal(
            isUrlsModalOpen,
            toggleUrlsModal,
            "מסמכים שהופקו",
            getUrls
          )}
          {listModal(
            isUrlsModalOpen,
            toggleUrlsModal,
            "מסמכים שהופקו",
            getUrls
          )}
          {saveModal(
            toSaveDataModal,
            toggleToSaveDataModal,
            handleSaving,
            "שמירה"
          )}
          {loadModal(toLoadDataModal, toggleToLoadDataModal)}
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
        {customerValidationFailed.failure ? (
          <p className="validationComment">
            {" "}
            הפקת חשבונית לא בוצעה! {customerValidationFailed.error}  {" "}
            {customerValidationFailed.customerName}
          </p>
        ) : null}
        <button
          className="save-tables"
          disabled={matrixData.length === 0}
          onClick={() => saveData()}
        >
          שמירה
        </button>
        <button
          className="save-tables"
          onClick={() => loadData()}
        >
          טעינה
        </button>
        <button
          className="createInvoice-button"
          disabled={matrixData.length === 0 || disableProduction}
          onClick={() => produceDoc(productsMap)}
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
