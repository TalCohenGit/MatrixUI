import {
  numOfColBeforeProducts,
  numOfColAfterProducts,
  titleWithoutProduct,
  savingAsAction,
  produceDocAction
} from "./constants";
import _ from "lodash";
import { format } from "date-fns";

export const filterCustomers = (parsedName, input) => {
  return input.length && parsedName?.length && parsedName.includes(input);
};

export const mapTable = (data, key) =>
  data.map((element) => {
    if (key !== "מערך מאופס") {
      return element[key];
    } else {
      return 0;
    }
  });

export const addProductsToBalanceTable = (
  currentTableData,
  data,
  numCurrentProducts
) => {
  if (!data.length) {
    return;
  }
  const newBalanceTable = [];
  let fieldsToMap = [
    { rowHeader: "פריט", rowKey: "מפתח פריט אב" },
    { rowHeader: "במלאי", rowKey: "יתרה כמותית במלאי" },
    { rowHeader: "בהזמנה", rowKey: "מערך מאופס" },
    { rowHeader: "נותר", rowKey: "יתרה כמותית במלאי" },
  ];
  fieldsToMap.forEach((field, rowIndx) => {
    const tableData = mapTable(data, field.rowKey);
    const newRow = [
      ...currentTableData[rowIndx].slice(
        0,
        numCurrentProducts + numOfColBeforeProducts
      ),
      ...tableData,
      ...currentTableData[rowIndx].slice(
        numCurrentProducts + numOfColBeforeProducts
      ),
    ];
    newBalanceTable.push(newRow);
  });
  return newBalanceTable;
};

export const deleteAllTables = (
  setMatrixData,
  setBalanceTableData,
  setMatrixComments,
  setSelectedProducts
) => {
  setMatrixData([]);
  setBalanceTableData([]);
  setSelectedProducts([]);
  setMatrixComments([]);
};

export const createBalanceTable = (data) => {
  if (!data.length) {
    return;
  }
  let tableRowData = [],
    currentBalanceData = [],
    fieldsToMap = [
      { rowHeader: "פריט", rowKey: "מפתח פריט אב" },
      { rowHeader: "במלאי", rowKey: "יתרה כמותית במלאי" },
      { rowHeader: "בהזמנה", rowKey: "מערך מאופס" },
      { rowHeader: "נותר", rowKey: "יתרה כמותית במלאי" },
    ];
  fieldsToMap.forEach((field) => {
    tableRowData = [
      null,
      null,
      field.rowHeader,
      ...mapTable(data, field.rowKey),
      null,
      null,
      null,
      null,
      null,
    ];
    currentBalanceData.push(tableRowData);
  });
  return currentBalanceData;
};

export const updateBalanceTable = (
  currentTableData,
  productsToAdd,
  productsData,
  numCurrentProducts
) => {
  const selectedProducts = productsData.filter((product) =>
    productsToAdd.includes(product["שם פריט"])
  );
  if (currentTableData.length === 0) {
    return createBalanceTable(selectedProducts);
  } else {
    return addProductsToBalanceTable(
      currentTableData,
      selectedProducts,
      numCurrentProducts
    );
  }
};

export const removeColFromTable = (colIndex, numOfColBeforeProducts, matrix) => {
 return matrix.map((row) => {
    let newArr;
    newArr = [
      ...row.slice(0, colIndex - numOfColBeforeProducts),
      ...row.slice(colIndex + 1 - numOfColBeforeProducts, row.length)
    ];
    return newArr;
  });
}

export const removeProductCol = (productIndx, currentMatrix, currentMatrixComments) => {
  const newMatrixData = removeColFromTable(productIndx, 0, currentMatrix)
  const newMatrixComments = removeColFromTable(productIndx, numOfColBeforeProducts, currentMatrixComments)
  console.log("newMatrixComments:", newMatrixComments)
  return {newMatrixData, newMatrixComments}
}

export const removeColFromBalanceTable = (
  currentBalanceTable,
  productsData,
  productName
) => {
  const selectedProduct = productsData.filter(
    (product) => productName === product["שם פריט"]
  )[0];
  const colIndexToRemove = currentBalanceTable[0].indexOf(selectedProduct["מפתח פריט אב"]);
  return removeColFromTable(colIndexToRemove, 0, currentBalanceTable)
};
export const numOfProducts = (matrixLength) =>
  matrixLength - titleWithoutProduct;

export const customerNumbers = (matrixData) => matrixData.length - 1;

export const removeRowFromBalanceTable = (
  balanceTableData,
  tableRowToRemove
) => {
  const newBalanceTable = [...balanceTableData];

  const productsNum = numOfProducts(tableRowToRemove.length);
  const inOrderRow = 2;
  const leftRow = 3;
  for (
    let i = numOfColBeforeProducts;
    i < numOfColBeforeProducts + productsNum;
    i++
  ) {
    newBalanceTable[inOrderRow][i] =
      newBalanceTable[inOrderRow][i] - tableRowToRemove[i];
    newBalanceTable[leftRow][i] =
      newBalanceTable[leftRow][i] + tableRowToRemove[i];
  }
  return newBalanceTable;
};

export const getUniqProducts = (productsData) => {
  return _.uniqBy(productsData, "שם פריט");
};

const validateValueExist = (valueToCheck, setComment) => {
  if (!valueToCheck) {
    setComment();
  }
};

export const getMatrixesData = async (
  matrixData,
  productsMap,
  matrixComments,
  action,
  setCustomerValidationFailed
) => {

  const validatedData = handleMatrixData(
    matrixData,
    productsMap,
    setCustomerValidationFailed,
    action
  );
  if (!validatedData) {
    return;
  }
  const { cellsData, docCommentsToSend, metaDataToSend } =
    handleCommentMatrixData(
      matrixComments,
      validatedData["docComments"],
      validatedData["metaData"]
    );
  return {
    validatedData,
    cellsData,
    docCommentsToSend,
    metaDataToSend,
  };
};

export const getRefreshToken = () => {
  // if(!refreshToken)
  return localStorage.getItem("refreshToken");
};

export const parseStrimingData = (dataToParse) => {
    let str = "["
  
    for (let i = 0; i <= dataToParse.length - 1; i++) {
      if (dataToParse[i] == "}" && dataToParse[i + 1] == "{") {
        str += dataToParse[i]
        str += ","
      } else {
        str += dataToParse[i]
      }
    }
    str += "]"
    return JSON.parse(str, null, 2)
}

export const getActionFromRes = (dataRes) => {
  const dataObj = dataRes?.length > 0 && dataRes[dataRes.length - 1]
  const producedObj = dataObj?.data?.resultData?.data[0]
  return producedObj?.Action
}

export const formatDate = (matrixDate) => {
  // return format(new Date(matrixDate), "MM/dd/yyyy")
   return new Date(matrixDate).toLocaleString('en', {  timeZone: "Asia/Jerusalem", })
}

const setError = (setCustomerValidationFailed, errorMsg, customerName) => {
  if (setCustomerValidationFailed) {
    setCustomerValidationFailed({
      failure: true,
      error: errorMsg,
      customerName,
    });
  }
};

export const handleMatrixData = (
  tableData,
  productsMap,
  setCustomerValidationFailed,
  action
) => {
  let matrix = JSON.parse(JSON.stringify(tableData));
  const titleLength = matrix[0].length;
  let tableDetails = matrix.slice(1);
  const newTableDetails = [];
  const acountKeys = [];
  const metaData = [];
  const documentIDs = [];
  const driverIDs = [];
  const actionIDs = [];
  const docComments = [];
  let validationFailed = false;

  for (let rowData of tableDetails) {
    acountKeys.push(rowData[1]);
    metaData.push(rowData.pop());
    docComments.push(rowData.pop());
    const actionID = rowData.pop();
    actionIDs.push(actionID);
    const driverID = rowData.pop();
    const docId = rowData.pop();
    documentIDs.push(docId);
    const validRow = rowData
      .slice(numOfColBeforeProducts)
      .find((element) => element !== 0);
    if (action === produceDocAction) {
      if (!validRow) {
        setError(
          setCustomerValidationFailed,
          "שדות ריקים עבור הלקוח: ",
          rowData[0]
        );
        validationFailed = true;
        break;
      }
      if (!driverID || !actionID || !docId) {
        setError(
          setCustomerValidationFailed,
          ":לא נבחרו כל השדות עבור הלקוח",
          rowData[0]
        );
        validationFailed = true;
        break;
      }
    }
    driverIDs.push(driverID);
    newTableDetails.push(rowData.slice(3));
  }

  if (action === produceDocAction && validationFailed) {
    return;
  }

  const products = matrix[0].slice(
    numOfColBeforeProducts,
    titleLength - numOfColAfterProducts
  );
  const productsWithKeys = products.map((element) => productsMap[element]);
  matrix = [productsWithKeys, ...newTableDetails];
  return {
    matrix,
    driverIDs,
    actionIDs,
    documentIDs,
    docComments,
    acountKeys,
    metaData,
  };
};

export const loadData = (matrixesUiData, stateToChange, index) => {
  if (matrixesUiData) {
    const loadedMatrix = matrixesUiData[index];
    if (loadedMatrix) {
      stateToChange(loadedMatrix);
      // stateToChange([]);
    }
  }
};


export const loadAllMatrixesData = (
  matrixesUiData,
  setArr
) => {
  if (matrixesUiData) {
    setArr.forEach((setAction, index) => {
      loadData(matrixesUiData, setAction, index);
    });
  }
};

const handleComments = (comments) => {
  const commentsObj = {};
  comments.forEach(
    (comment) => (commentsObj[comment["selectValue"]] = comment["inputValue"])
  );
  return commentsObj;
};

export const handleCommentMatrixData = (
  matrixComments,
  docComments,
  metaData
) => {
  const cellsData = [];
  const docCommentsToSend = [];
  const metaDataToSend = [];
  matrixComments.forEach((commentsRow, index) => {
    let rowData = [];
    commentsRow.forEach((comments) => {
      if (!comments) {
        rowData.push(null);
      } else {
        const commentsObj = handleComments(comments);
        rowData.push(commentsObj);
      }
    });
    cellsData.push(rowData);
    let docData = null;
    if (docComments[index]) {
      docData = handleComments(docComments[index]);
    }
    docCommentsToSend.push(docData);
    if (metaData[index]) {
      metaDataToSend.push({ Details: metaData[index] });
    } else {
      metaDataToSend.push(null);
    }
  });
  return { cellsData, docCommentsToSend, metaDataToSend };
};

export const getProductsNameKeyMap = (products) => {
  const productNameKey = {};
  products.map(
    (element) => (productNameKey[element["שם פריט"]] = element["מפתח פריט"])
  );
  return productNameKey;
};

export const getItemNames = (itemsKeys, productsMap) => {
  const itemsNameArr = [];
  
  itemsKeys.forEach((itemKey) => {
    const productName = Object.keys(productsMap).find(key => productsMap[key] === itemKey);
    itemsNameArr.push(productName);
  });
  return itemsNameArr;
};
