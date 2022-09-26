import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";
import {
  handleMatrixData,
  handleCommentMatrixData,
  customerNumbers,
  deleteAllTables,
  getActionFromRes
} from "../utils/utils";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import CircularProgress from "@mui/material/CircularProgress";
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
import UrlCheckboxes from "./UrlCheckboxes/UrlCheckboxes";
import LoaderContainer from "./LoaderContainer/LoaderContainer";
import SaveModal from "./SaveModal/SaveModal";

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
    setMatrixData,
    setBalanceTableData,
    setMatrixComments,
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
  const [dateValue, setDateValue] = useState(new Date());
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
  const [checked, setChecked] = useState([]);

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

  const deleteAll = () => {
    deleteAllTables(setMatrixData, setBalanceTableData, setMatrixComments, setSelectedProducts)
  }

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
      const produceRes = await sendTableAPI(
        axiosPrivate,
        validatedData,
        newMatrixId,
        cellsData,
        docCommentsToSend,
        metaDataToSend,
        productsMap
      );
      const action = getActionFromRes(produceRes)
      const urlDataArr = await getUrlsAPI(axiosPrivate, action);
      const relavantUrls = urlDataArr.slice(
        urlDataArr.length - customerNumbers(matrixData),
        urlDataArr.length
      );
      setProducedUrls(relavantUrls);
      toggleUrlsModal(true);
      setDisableProduction(false);
    } catch (e) {
      console.log("error in produceDoc:", e);
    }
  };

  const handleChecked = (urlIndex) => {
    const currentChecked = [...checked];
    currentChecked[urlIndex] = !currentChecked[urlIndex];
    setChecked(currentChecked);
  };

  const saveData = () => {
    toggleToSaveDataModal(true);
  };

  const loadData = () => {
    toggleToLoadDataModal(true);
  };

  const handleSaving = async () => {
    const isBI = true;
    await saveTables(isBI, dateValue, savedMatrixName);
    cancelSave();
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

  const cancelSave = () => {
    toggleToSaveDataModal(false);
    setDateValue(new Date());
  };

  const cancleLoading = () => {
    toggleToLoadDataModal(false);
    toggleMatrixNames(false);
    setMatrixesDetails([]);
    setDateRanges(intialRangeState);
  };

  const LoadModal = (toLoadDataModal) => {
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

  const ListModal = ({ isOpen, toggleModal, header }) => {
    return (
      isOpen &&
      (producedUrls?.length ? (
        <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={header}>
          {/* <div>{dataToShow}</div> */}
          <React.Fragment>
            <UrlCheckboxes
              axiosPrivate={axiosPrivate}
              producedUrls={producedUrls}
              toggleModal={toggleModal}
            />
          </React.Fragment>
        </Modal>
      ) : (
        <LoaderContainer />
      ))
    );
  };

  const customStyles = {
    option: () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px",
      marginLeft: "10px",
      marginRight: "10px",
      "&:hover": {
        backgroundColor: "#d3d3d3",
        cursor: "pointer",
      },
    }),
    menu: () => ({
      direction: "ltr",
    }),
    input: () => ({
      fontSize: "40px",
    }),
  };

  return (
    <>
      <div className="addCustomer-wrapper">
        <div className="addCustomer-input-wrapper">
          {
            <ListModal
              isOpen={isUrlsModalOpen}
              toggleModal={toggleUrlsModal}
              header={"מסמכים שהופקו"}
            />
          }
          {
           <SaveModal
          isOpen={toSaveDataModal}
          toggleModal={toggleToSaveDataModal}
          cancelSave={cancelSave}
          dateValue={dateValue}
          setDateValue={setDateValue}
          //  handleSaving={toSaveDataModal}
           handleAction={handleSaving}
           action="שמירה"
           savedMatrixName={savedMatrixName}
           setSavedMatrixName={setSavedMatrixName}

           />
          //  isOpen, toggleModal, handleAction, action,savedMatrixName
          // SaveModal(
          //   toSaveDataModal,
          //   toggleToSaveDataModal,
          //   handleSaving,
          //   "שמירה"
          // )
          }
          {LoadModal(toLoadDataModal, toggleToLoadDataModal)}
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
          <SearchList matrixData={matrixData} />
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
            הפקת חשבונית לא בוצעה! {customerValidationFailed.error}{" "}
            {customerValidationFailed.customerName}
          </p>
        ) : null}
        <button
          className="save-tables"
          disabled={matrixData.length === 0}
          onClick={() => saveData()}
        >
         שמירה בשם
        </button>
        <button className="save-tables" onClick={() => loadData()}>
          טעינה
        </button>
        <button
          className="createInvoice-button"
          disabled={matrixData.length === 0 || disableProduction}
          onClick={() => produceDoc(productsMap)}
        >
          הפקת חשבונית
        </button>
        <button
          className="deleteAll-button" disabled=
          {matrixData.length === 0}
          onClick={() => deleteAll()}
          >
          מחק הכל  
        </button>
      </div>
      {errorMessage?.length ? (
        <p className="error-message">{errorMessage}</p>
      ) : null}
    </>
  );
};

export default AddCustomer;
