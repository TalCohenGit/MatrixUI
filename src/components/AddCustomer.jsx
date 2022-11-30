import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";
import {
  handleMatrixData,
  handleCommentMatrixData,
  customerNumbers,
  deleteAllTables,
  getActionFromRes,
  parseStrimingData,
  getFormattedDates,
} from "../utils/utils";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import {
  getMatrixIDAPI,
  getUrlsAPI,
  createDocAPI,
  getTablesByDatesAPI,
  deleteMatrixAPI,
  getProgressBarAPI,
  getUrlsByDatesAPI,
} from "../api";
import Modal from "../common/components/Modal/Modal";
import { addDays } from "date-fns";
import UrlCheckboxes from "./UrlCheckboxes/UrlCheckboxes";
import LoaderContainer from "./LoaderContainer/LoaderContainer";
import SaveModal from "./SaveModal/SaveModal";
import LoadModal from "./Modals/LoadModal";
import AreUSureModal from "./Modals/AreUSureModal";
import ErrorModal from "./Modals/ErrorModal";
import {
  savingAction,
  savingAsAction,
  produceDocAction,
  copyMatrixAction,
} from "../utils/constants";

const AddCustomer = ({
  customerName,
  setCustomerName,
  addCustomerToTable,
  handleProducts,
  axiosPrivate,
  saveTables,
  loadTables,
  matrixName,
  setMatrixName,
  matrixDate,
  setMatrixDate,
  copyMatrix,
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
    setIsInProgress,
    setProgressValue,
    isInProgress,
  } = useContext(DataContext);

  const intialRangeState = [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ];

  const [customerValidationFailed, setCustomerValidationFailed] = useState({
    failure: false,
    error: "",
  });
  const [isUrlsModalOpen, toggleUrlsModal] = useState(false);
  const [isUrlModalSearch, toggleUrlsSearchModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [disableProduction, setDisableProduction] = useState(false);
  const [toSaveDataModal, toggleToSaveDataModal] = useState(false);
  const [toUpdateDataModal, toggleToUpdateDataModal] = useState(false);
  const [toLoadDataModal, toggleToLoadDataModal] = useState(false);
  const [toSearchDocsModal, toggleToSearchDocs] = useState(false);
  const [isMatrixNames, toggleMatrixNames] = useState(false);
  const [matrixesDetails, setMatrixesDetails] = useState([]);
  const [toDeleteDataModal, toggleToDeleteData] = useState(false);
  const [toDeleteMatrixModal, toggleToDeleteMatrix] = useState(false);
  const [toCopyDataModal, toggleToCopyDataModal] = useState(false);
  const [detailsToCopyModal, toggleDetailsToCopyModal] = useState(false);
  const [dateRangesLoad, setDateRangesLoad] = useState(intialRangeState);
  const [dateRangesSearch, setDateRangesSearch] = useState(intialRangeState);
  const [checked, setChecked] = useState([]);
  const [errorModal, toggleErrorModal] = useState(false);

  // const handleCopy = () => {
  //   toggleToCopyDataModal(false);
  //   toggleDetailsToCopyModal(true);
  // };

  // const cancelCopyModal = () => {
  //   toggleToCopyDataModal(false);
  // };

  const productsOptions = [];

  products &&
    products.forEach((element) => {
      productsOptions.push({
        value: element["שם פריט"],
        label: element["שם פריט"],
      });
    });
  const options = [{ value: "*", label: "הכל" }, ...productsOptions];

  const fetchStream = async (fileName) => {
    return await getProgressBarAPI(axiosPrivate, fileName)
      .then((response) => response.body)
      .then((rb) => {
        const reader = rb.getReader();

        return new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                // If there is no more data to read
                if (done) {
                  console.log("done", done);
                  controller.close();
                  return;
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value);
                // Check chunks by logging to the console
                const decodedValue = new TextDecoder().decode(value);
                let newValue = 0;
                console.log("dec", decodedValue);
                if (decodedValue === "finish") {
                  newValue = 100;
                } else {
                  const newObj = JSON.parse(decodedValue).stats;
                  const { amountFinished, totalToProcess } = newObj;
                  if (totalToProcess > 0) {
                    newValue = amountFinished * (100 / totalToProcess);
                  }
                }

                setProgressValue(newValue);
                push();
              });
            }

            push();
          },
        });
      })
      .then((stream) =>
        // Respond with our stream
        new Response(stream, {
          headers: { "Content-Type": "text/html" },
        }).text()
      )
      .then((result) => {
        // Do things with result
        console.log(result);
      });
  };

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
    handleProducts(selectedValues, event);
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
    deleteAllTables(
      setMatrixData,
      setBalanceTableData,
      setMatrixComments,
      setSelectedProducts
    );
  };

  const handleDeleteData = () => {
    toggleToDeleteData(true);
  };

  const cancleDelete = () => {
    toggleToDeleteData(false);
  };

  const handleDeleteMatrix = () => {
    toggleToDeleteMatrix(true);
  };

  const cancleDeleteMatrix = () => {
    toggleToDeleteMatrix(false);
  };

  const deleteMatrix = async () => {
    await deleteMatrixAPI(axiosPrivate, matrixID);
    deleteAllTables(
      setMatrixData,
      setBalanceTableData,
      setMatrixComments,
      setSelectedProducts
    );
    setMatrixName("");
    setMatrixDate("");
    toggleToDeleteMatrix(false);
  };

  const deleteData = () => {
    deleteAllTables(
      setMatrixData,
      setBalanceTableData,
      setMatrixComments,
      setSelectedProducts
    );
    toggleToDeleteData(false);
  };

  const produceDoc = async (productsMap) => {
    if (matrixData.length <= 1) {
      return;
    }
    const validatedData = handleMatrixData(
      matrixData,
      productsMap,
      setCustomerValidationFailed,
      produceDocAction
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
    // if (new Date(matrixDate).toDateString() !== new Date().toDateString()) {
    //   newMatrixId = await getMatrixIDAPI(axiosPrivate);
    // }
    try {
      const fileName = Math.random().toString();
      setIsInProgress(true);
      createDocAPI(
        axiosPrivate,
        validatedData,
        newMatrixId,
        cellsData,
        docCommentsToSend,
        metaDataToSend,
        productsMap,
        matrixName,
        fileName
      ).then(async (res) => {
        const parsedData = parseStrimingData(res.data);
        const action = getActionFromRes(parsedData);
        const invoiceDataArr = await getUrlsAPI(axiosPrivate, action);
        const relavantInvoiceData = invoiceDataArr.slice(
          invoiceDataArr.length - customerNumbers(matrixData),
          invoiceDataArr.length
        );
        setInvoiceData(relavantInvoiceData);
        toggleUrlsModal(true);
        setIsInProgress(false);
        setProgressValue(0);
      });

      fetchStream(fileName);
    } catch (e) {
      console.log("error in produceDoc:", e);
      setIsInProgress(false);
      setProgressValue(0);
      toggleErrorModal(true);
    }
  };

  const handleChecked = (urlIndex) => {
    const currentChecked = [...checked];
    currentChecked[urlIndex] = !currentChecked[urlIndex];
    setChecked(currentChecked);
  };

  const saveWithNameData = () => {
    toggleToSaveDataModal(true);
  };

  const savingMatrix = () => {
    toggleToUpdateDataModal(true);
  };

  const loadData = () => {
    toggleToLoadDataModal(true);
  };

  const handleSaving = async (
    action,
    toggleModal,
    isBI,
    newMatrixName,
    dateValue
  ) => {
    const newIsInitiated = true;
    await saveTables(dateValue, isBI, action, newIsInitiated, newMatrixName);
    setMatrixName(newMatrixName);
    setMatrixDate(dateValue);
    toggleModal(false);
  };

  const loadTableNames = async () => {
    const { startDate, endDate } = getFormattedDates(
      dateRangesLoad[0]["startDate"],
      dateRangesLoad[0]["endDate"]
    );
    const matrixesDetails = await getTablesByDatesAPI(
      axiosPrivate,
      startDate,
      endDate
    );
    if (matrixesDetails?.length) {
      setMatrixesDetails(matrixesDetails);
      toggleMatrixNames(true);
    } else {
      setMatrixesDetails([]);
    }
  };

  const loadUrls = async () => {
    const { startDate, endDate } = getFormattedDates(
      dateRangesSearch[0]["startDate"],
      dateRangesSearch[0]["endDate"]
    );
    const invoices = await getUrlsByDatesAPI(axiosPrivate, startDate, endDate);
    setSearchedInvoices(invoices);
    toggleToSearchDocs(false);
    toggleUrlsSearchModal(true);
  };

  const loadTablesByID = async (matrixID) => {
    await loadTables(matrixID);
    cancelLoading();
  };

  const cancelLoading = () => {
    toggleToLoadDataModal(false);
    toggleMatrixNames(false);
    setMatrixesDetails([]);
    setDateRangesLoad(intialRangeState);
  };

  const cancleSearch = () => {
    toggleToSearchDocs(false);
  };

  const ListModal = ({ isOpen, toggleModal, header, invoices }) => {
    return (
      isOpen &&
      (invoices?.length ? (
        <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={header}>
          {/* <div>{dataToShow}</div> */}
          <React.Fragment>
            <UrlCheckboxes
              axiosPrivate={axiosPrivate}
              invoiceData={invoices}
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

  const handleSearchDocs = () => {
    toggleToSearchDocs(true);
  };

  const finishProduce = () => {
    toggleUrlsModal(false);
    // toggleToCopyDataModal(true);
    toggleDetailsToCopyModal(true);
  };

  return (
    <>
      <div className="addCustomer-wrapper">
        <div className="addCustomer-input-wrapper">
          <AreUSureModal
            isOpen={toDeleteMatrixModal}
            toggleModal={toggleToDeleteMatrix}
            onCancel={cancleDeleteMatrix}
            onDelete={deleteMatrix}
            header={"האם אתה בטוח שברצונך למחוק את המטריצה?"}
            deleteBtnText={"מחק מטריצה"}
          />
          <AreUSureModal
            isOpen={toDeleteDataModal}
            toggleModal={toggleToDeleteData}
            onCancel={cancleDelete}
            onDelete={deleteData}
            header={"האם אתה בטוח שברצונך למחוק נתונים?"}
            deleteBtnText={"מחק נתונים"}
          />
          <ListModal
            isOpen={isUrlsModalOpen}
            toggleModal={finishProduce}
            header={"מסמכים שהופקו"}
            invoices={invoiceData}
          />
          <ListModal
            isOpen={isUrlModalSearch}
            toggleModal={toggleUrlsSearchModal}
            header={"מסמכים שהופקו"}
            invoices={searchedInvoices}
          />
          <SaveModal
            isOpen={detailsToCopyModal}
            toggleModal={toggleDetailsToCopyModal}
            handleAction={copyMatrix}
            action={copyMatrixAction}
          />
          <SaveModal
            isOpen={toSaveDataModal}
            toggleModal={toggleToSaveDataModal}
            handleAction={handleSaving}
            action={savingAsAction}
            matrixName={matrixName}
          />
          <SaveModal
            isOpen={toUpdateDataModal}
            toggleModal={toggleToUpdateDataModal}
            handleAction={handleSaving}
            action={savingAction}
            matrixName={matrixName}
          />
          <LoadModal
            isOpen={toLoadDataModal}
            toggleModal={cancelLoading}
            dateRanges={dateRangesLoad}
            setDateRanges={setDateRangesLoad}
            onCancel={cancelLoading}
            onSearch={loadTableNames}
            isMatrixNames={isMatrixNames}
            matrixesDetails={matrixesDetails}
            loadTablesByID={loadTablesByID}
            modalHeader={"טעינת מטריצות"}
          />
          <LoadModal
            isOpen={toSearchDocsModal}
            toggleModal={toggleToSearchDocs}
            dateRanges={dateRangesSearch}
            setDateRanges={setDateRangesSearch}
            onCancel={cancleSearch}
            onSearch={loadUrls}
            isMatrixNames={isMatrixNames}
            matrixesDetails={matrixesDetails}
            loadTablesByID={loadTablesByID}
            modalHeader={"חיפוש מסמכים לפי תאריכים"}
          />
          <ErrorModal
            isOpen={errorModal}
            toggleModal={toggleErrorModal}
            error={"המטריצה נכשלה בהפקה. נא נסה שנית או פנה לתמיכה הטכנית במייל bizmod.solutions@gmail.com"}
          />
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
          disabled={matrixData?.length === 0 || !matrixID}
          onClick={() => savingMatrix()}
        >
          שמירה
        </button>
        <button
          className="save-tables"
          disabled={matrixData.length === 0}
          onClick={() => saveWithNameData()}
        >
          שמירה בשם
        </button>
        <button className="save-tables" onClick={() => loadData()}>
          טעינה
        </button>
        <button
          className={"createInvoice-button" + (isInProgress ? " disabled" : "")}
          disabled={matrixData.length === 0}
          onClick={() => produceDoc(productsMap)}
        >
          הפקת חשבונית
        </button>
        <button
          className="deleteAll-button"
          disabled={matrixData.length === 0}
          onClick={() => handleDeleteData()}
        >
          מחק נתונים
        </button>
        <button
          className="deleteAll-button"
          onClick={() => handleDeleteMatrix()}
        >
          מחק מטריצה
        </button>
        <button className="deleteAll-button" onClick={() => handleSearchDocs()}>
          חיפוש מסמכים
        </button>
      </div>
      {errorMessage?.length ? (
        <p className="error-message">{errorMessage}</p>
      ) : null}
    </>
  );
};

export default AddCustomer;
