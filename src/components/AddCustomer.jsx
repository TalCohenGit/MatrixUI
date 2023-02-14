import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import SearchList from "./SearchList";
import {
  handleMatrixData,
  handleCommentMatrixData,
  customerNumbers,
  deleteAllTables,
  getFormattedDates,
  getMatrixesDataObj,
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
import SaveModal from "./SaveModal/SaveModal";
import LoadModal from "./Modals/LoadModal";
import AreUSureModal from "./Modals/AreUSureModal";
import { savingAction, savingAsAction, produceDocAction, copyMatrixAction } from "../utils/constants";
import { produceError } from "../utils/constants";
import Toast from "./Toast/Toast";
import SearchMatrixes from "./SearchMatrixes";
import SearchDocs from "./SearchDocs";
import CopyDataModal from "../components/Modals/CopyDataModal";
import { molestLoggerApi } from "../hooks/useLogerApi";
import { counter } from "@fortawesome/fontawesome-svg-core";

const AddCustomer = ({
  savedData,
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
  newMatrixName,
  setNewMatrixName,
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
    setMatrixID,
    selectedProducts,
    setSelectedProducts,
    setIsInProgress,
    setProgressValue,
    isInProgress,
  } = useContext(DataContext);
  console.log("mmmmma", { matrixData, savedData });
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
  const [errorMsg, setErrorMsg] = useState({
    show: false,
    text: produceError,
  });

  const [isUrlsModalOpen, toggleUrlsModal] = useState(false);
  const [isUrlModalSearch, toggleUrlsSearchModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [toSaveDataModal, toggleToSaveDataModal] = useState(false);
  const [toUpdateDataModal, toggleToUpdateDataModal] = useState(false);
  const [toLoadDataModal, toggleToLoadDataModal] = useState(false);
  const [toSearchDocsModal, toggleToSearchDocs] = useState(false);
  const [isMatrixNames, toggleMatrixNames] = useState(false);
  const [matrixesDetails, setMatrixesDetails] = useState([]);
  const [toDeleteDataModal, toggleToDeleteData] = useState(false);
  const [toDeleteMatrixModal, toggleToDeleteMatrix] = useState(false);
  const [detailsToCopyModal, toggleDetailsToCopyModal] = useState(false);
  const [dateRangesLoad, setDateRangesLoad] = useState(intialRangeState);
  const [dateRangesSearch, setDateRangesSearch] = useState(intialRangeState);
  const [checked, setChecked] = useState([]);
  const [errorModal, toggleErrorModal] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [stepsAfterProduce, toggleStepsAfterProduce] = useState(false);

  const productsOptions = [];
  /******** * REGULAR PR OBJECT     */
  //  {
  //   data: null,
  //   termenate: false,
  //   stageName: "c",
  //   msg: "נשמר בהצלחה",
  //   errors: "no errors",
  //   gotStats: false,
  //   stats: { amountFinished: 0, totalToProcess: 0 },
  // };

  /******** * PR OBJECT WITH START OF ERROR    */
  // let newd = {
  //   data: "no",
  //   termenate: true,
  //   stageName: "serverError",
  //   msg: "serverError",
  //   errors: [
  //     {
  //       path: "matrixID",
  //       error: "missing",
  //     },
  //     {
  //       path: "matrixesData.mainMatrix",
  //       error: "unequal arrays length",
  //     },
  //   ],
  //   gotStats: false,
  //   stats: { amountFinished: 0, totalToProcess: 0 },
  // };

  const setUrlsTableValues = (combinedData) => {
    setInvoiceData(
      //  data.map((el) => {
      combinedData.map((el) => {
        const { Accountname, Action, DocNumber, DocUrl, DocumentDetails, TotalCost, ValueDate } = el;
        return {
          DocUrl,
          Accountname,
          Action,
          ValueDate,
          TotalCost,
          DocNumber,
          DocumentDetails,
        };
      })
    );
    toggleUrlsModal(true);
  };

  products &&
    products.forEach((element) => {
      productsOptions.push({
        value: element["שם פריט"],
        label: element["שם פריט"],
      });
    });
  const options = [{ value: "*", label: "הכל" }, ...productsOptions];

  const getProgressBar = async (rowsNumber, fileName) => {
    const DELAY_TIME = 20000;

    let counter = 0;
    let combinedData = [];
    let newValue = 0;
    let newCounter = 0;

    return await getProgressBarAPI(rowsNumber, fileName)
      .then((response) => response.body)
      .then((rb) => {
        const reader = rb.getReader();

        return new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                //    let serverError = value ? new TextDecoder(value) : null;

                // If there is no more data to read

                if (done) {
                  setUrlsTableValues(combinedData);

                  controller.close();
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value);
                // Check chunks by logging to the console

                const decodedValue = new TextDecoder().decode(value);

                let handeler = setTimeout(() => {
                  if (done) return;
                  molestLoggerApi(decodedValue);
                  setErrorMsg({
                    show: true,
                    text: produceError,
                  });
                  controller.close();
                }, DELAY_TIME);
                if (newCounter != counter) {
                  clearTimeout(handeler);
                }
                newCounter = counter;
                console.log("decodedValue", decodedValue);

                let { stats, gotStats, data, stageName } = JSON.parse(decodedValue);
                if (stageName === "finish") newValue = 100;
                else {
                  if (data) combinedData.push(data);

                  const { amountFinished, totalToProcess } = stats;
                  if (totalToProcess > 0 && gotStats) {
                    newValue = amountFinished * (100 / totalToProcess);
                  }
                }
                counter += 1;
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
    } else if (event.action === "deselect-option" && event.option.value === "*") {
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
    deleteAllTables(setMatrixData, setBalanceTableData, setMatrixComments, setSelectedProducts);
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

  const deleteAllMatrixDate = () => {
    deleteAllTables(setMatrixData, setBalanceTableData, setMatrixComments, setSelectedProducts);

    setMatrixDate(new Date());
  };

  const deleteMatrix = async () => {
    await deleteMatrixAPI(axiosPrivate, matrixID);
    deleteAllMatrixDate();
    toggleToDeleteMatrix(false);
  };

  const deleteData = () => {
    deleteAllTables(setMatrixData, setBalanceTableData, setMatrixComments, setSelectedProducts);
    toggleToDeleteData(false);
  };

  const produceDoc = async (productsMap) => {
    if (matrixData.length < 1) {
      return;
    }
    if (!matrixName?.length) {
      setCustomerValidationFailed({
        failure: true,
        error: "על מנת להפיק יש לבחור שם למטריצה בשמירה בשם",
      });
      return;
    }

    const validatedData = handleMatrixData(matrixData, productsMap, setCustomerValidationFailed, produceDocAction);

    if (!validatedData) {
      return;
    }
    setCustomerValidationFailed({
      ...customerValidationFailed,
      failure: false,
    });
    const { cellsData, docCommentsToSend, metaDataToSend } = handleCommentMatrixData(
      matrixComments,
      validatedData["docComments"],
      validatedData["metaData"]
    );

    let newMatrixId = matrixID;
    if (!newMatrixId) {
      newMatrixId = await getMatrixIDAPI(axiosPrivate);
    }

    try {
      const fileName = Math.random().toString();
      setIsInProgress(true);
      const matrixesData = getMatrixesDataObj(
        newMatrixId,
        validatedData,
        cellsData,
        docCommentsToSend,
        metaDataToSend,
        productsMap
      );
      if (!matrixesData) {
        setCustomerValidationFailed({
          failure: true,
          error: "תקלה בהפקה",
        });
        return;
      }
      createDocAPI(axiosPrivate, newMatrixId, matrixName, fileName, matrixesData)
        .then(async (res) => {
          console.log("data ", res.data.data);
          if (res?.data?.data?.status == "no") {
            console.log("status no");
            molestLoggerApi(res.data.data.data);
            setErrorMsg({
              show: true,
              text: produceError,
            });
          } else await getProgressBar(matrixesData.mainMatrix.AccountKey.length, fileName);
          setIsInProgress(false);
          setProgressValue(0);
          updateProducedInUI();
        })
        .catch((error) => {
          setIsInProgress(false);
          setProgressValue(0);
          // toggleErrorModal(true);
          setErrorMsg({
            show: true,
            text: produceError,
          });
        });
    } catch (e) {
      setIsInProgress(false);
      setProgressValue(0);
      toggleErrorModal(true);
      setErrorMsg({
        show: true,
        text: produceError,
      });
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

  const handleSaving = async (action, toggleModal, isBI, newMatrixName, dateValue) => {
    const newIsInitiated = true;
    await saveTables(dateValue, isBI, action, newIsInitiated, newMatrixName);
    setMatrixName(newMatrixName);
    setMatrixDate(dateValue);
    toggleModal(false);
  };

  const loadTableNames = async () => {
    const { startDate, endDate } = getFormattedDates(dateRangesLoad[0]["startDate"], dateRangesLoad[0]["endDate"]);
    const matrixesDetails = await getTablesByDatesAPI(axiosPrivate, startDate, endDate);
    if (matrixesDetails?.length) {
      if (noResults) {
        setNoResults(false);
      }
      setMatrixesDetails(matrixesDetails);
      toggleMatrixNames(true);
    } else {
      setMatrixesDetails([]);
      setNoResults(true);
    }
  };

  const loadUrls = async () => {
    const { startDate, endDate } = getFormattedDates(dateRangesSearch[0]["startDate"], dateRangesSearch[0]["endDate"]);

    const invoices = await getUrlsByDatesAPI(axiosPrivate, startDate, endDate);
    if (invoices?.length) {
      if (noResults) {
        setNoResults(false);
      }
      setSearchedInvoices(invoices);
      toggleToSearchDocs(false);
      toggleUrlsSearchModal(true);
    } else {
      setNoResults(true);
    }
  };

  const loadTablesByID = async (matrixID) => {
    await loadTables(matrixID);
    cancelLoading();
  };

  const cancelLoading = () => {
    toggleToLoadDataModal(false);
    setNoResults(false);
    toggleMatrixNames(false);
    setMatrixesDetails([]);
    setDateRangesLoad(intialRangeState);
  };

  const cancelSearch = () => {
    if (noResults) {
      setNoResults(false);
    }
    toggleToSearchDocs(false);
  };

  const ListModal = ({ isOpen, toggleModal, header, invoices }) => {
    console.log("invoices".invoices);
    return (
      isOpen &&
      (invoices?.length ? (
        <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={header}>
          {/* <div>{dataToShow}</div> */}
          <React.Fragment>
            <UrlCheckboxes axiosPrivate={axiosPrivate} invoiceData={invoices} toggleModal={toggleModal} />
          </React.Fragment>
        </Modal>
      ) : (
        <div />
      ))
    );
  };

  // const isProducedDisabled = () => {
  //   return isInProgress || !matrixName
  // }

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
    toggleStepsAfterProduce(true);
  };

  const handleCopy = () => {
    toggleDetailsToCopyModal(true);
    toggleStepsAfterProduce(false);
  };

  const createNewMatrix = (name) => {
    console.log("creating new matrix", name);
    deleteAllMatrixDate();
    setMatrixName(name);
    setMatrixID("");
    toggleStepsAfterProduce(false);
  };

  const updateProducedInUI = () => {
    const currentData = [...matrixData];

    for (let row of currentData) {
      if (row[0] === "שם לקוח") {
        continue;
      }

      row[row.length - 3] = 4;
    }

    setMatrixData(currentData);
  };

  return (
    <>
      <div className="addCustomer-wrapper">
        <div className="addCustomer-input-wrapper">
          <Toast
            isOpen={errorMsg.show}
            text={errorMsg.text}
            handleClose={() => {
              setErrorMsg({
                ...errorMsg,
                show: false,
              });
            }}
          />
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
          <CopyDataModal
            isOpen={stepsAfterProduce}
            toggleModal={toggleStepsAfterProduce}
            onCopy={handleCopy}
            modalHeader={"בשביל להמשיך ניתן לשכפל את המטריצה או ליצור מטריצה חדשה"}
            afterProduce={true}
            onNewMatrix={createNewMatrix}
            action={copyMatrixAction}
            matrixName={matrixName}
            isProduced={savedData?.isProduced}
            setMatrixName={setMatrixName}
            setNewMatrixName={setNewMatrixName}
            newMatrixName={newMatrixName}
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
            matrixName={matrixName}
            isOpen={detailsToCopyModal}
            toggleModal={toggleDetailsToCopyModal}
            handleAction={copyMatrix}
            action={copyMatrixAction}
            newMatrixName={newMatrixName}
            setNewMatrixName={setNewMatrixName}
          />
          <SaveModal
            matrixName={matrixName}
            isOpen={toSaveDataModal}
            toggleModal={toggleToSaveDataModal}
            handleAction={handleSaving}
            action={savingAsAction}
            newMatrixName={newMatrixName}
            setNewMatrixName={setNewMatrixName}
          />
          <SaveModal
            matrixName={matrixName}
            isOpen={toUpdateDataModal}
            toggleModal={toggleToUpdateDataModal}
            handleAction={handleSaving}
            action={savingAction}
            newMatrixName={newMatrixName}
            setNewMatrixName={setNewMatrixName}
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
            noResults={noResults}
            setNoResults={setNoResults}
            Component={
              <SearchMatrixes
                setNewMatrixName={setMatrixName}
                matrixesDetails={matrixesDetails}
                loadTablesByID={loadTablesByID}
                noResults={noResults}
                isMatrixNames={isMatrixNames}
              />
            }
          />
          <LoadModal
            isOpen={toSearchDocsModal}
            toggleModal={toggleToSearchDocs}
            dateRanges={dateRangesSearch}
            setDateRanges={setDateRangesSearch}
            onCancel={cancelSearch}
            onSearch={loadUrls}
            modalHeader={"חיפוש מסמכים לפי תאריכים"}
            Component={<SearchDocs noResults={noResults} />}
          />
          {/* <ErrorModal
            isOpen={errorModal}
            toggleModal={toggleErrorModal}
            error={"המטריצה נכשלה בהפקה. נא נסה שנית או פנה לתמיכה הטכנית במייל bizmod.solutions@gmail.com"}
          /> */}
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
            הפקת חשבונית לא בוצעה! {customerValidationFailed.error} {customerValidationFailed.customerName}
          </p>
        ) : null}
        <button className="save-tables" disabled={matrixData?.length === 0 || !matrixID} onClick={() => savingMatrix()}>
          שמירה
        </button>
        <button className="save-tables" disabled={matrixData.length === 0} onClick={() => saveWithNameData()}>
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
        <button className="deleteAll-button" disabled={matrixData.length === 0} onClick={() => handleDeleteData()}>
          מחק נתונים
        </button>
        <button className="deleteAll-button" onClick={() => handleDeleteMatrix()}>
          מחק מטריצה
        </button>
        <button className="deleteAll-button" onClick={() => handleSearchDocs()}>
          חיפוש מסמכים
        </button>
      </div>
      {errorMessage?.length ? <p className="error-message">{errorMessage}</p> : null}
    </>
  );
};

export default AddCustomer;
