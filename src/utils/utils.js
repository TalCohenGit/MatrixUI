import { numOfColBeforeProducts, numOfColAfterProducts } from "./constants";
import _ from "lodash";

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

export const removeFromBalanceTable = (
  currentBalanceTable,
  productsData,
  productName
) => {
  const selectedProduct = productsData.filter(
    (product) => productName === product["שם פריט"]
  )[0]
  let colIndexToRemove = 0;
  return currentBalanceTable.map((row, rowIndx) => {
    let newArr;
    if (rowIndx === 0) {
      colIndexToRemove = row.indexOf(selectedProduct["מפתח פריט אב"]);
    }
    newArr = [
      ...row.slice(0, colIndexToRemove),
      ...row.slice(colIndexToRemove + 1, row.length),
    ];
    return newArr
  });
};

export const getUniqProducts = (productsData) => {
  return _.uniqBy(productsData, "שם פריט");
};

const validateValueExist = (valueToCheck, setComment) => {
  if (!valueToCheck) {
    setComment();
  }
};

export const handleMatrixData = (
  tableData,
  productsMap,
  setCustomerValidationFailed
) => {
  let matrix = JSON.parse(JSON.stringify(tableData));
  const titleLength = matrix[0].length;
  let tableDetails = matrix.slice(1);
  const acountKeys = [];
  const metaData = [];
  const documentIDs = [];
  const actionIDs = [];
  const driverIDs = [];
  const docComments = [];
  tableDetails = tableDetails.map((rowData) => {
    acountKeys.push(rowData[1]);
    metaData.push(rowData.pop());
    docComments.push(rowData.pop());
    const docId = rowData.pop();
    documentIDs.push(docId);
    const actionID = rowData.pop();
    actionIDs.push(actionID);
    const driverID = rowData.pop();
    if (!driverID || !actionID || !docId) {
      const customerName = rowData[0];
      setCustomerValidationFailed(customerName);
      return;
    }
    driverIDs.push(driverID);
    return rowData.slice(3);
  });

  if (!driverIDs.length) {
    return;
  }

  const products = matrix[0].slice(
    numOfColBeforeProducts,
    titleLength - numOfColAfterProducts
  );
  const productsWithKeys = products.map((element) => productsMap[element]);
  matrix = [productsWithKeys, ...tableDetails];
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
    cellsData.push(rowData)
    let docData = null;
    if (docComments[index]) {
      // docComments[index].forEach(
      //   (comment) => (docData[comment["selectValue"]] = comment["inputValue"])
      // );
      docData = handleComments(docComments[index]);
    }
    docCommentsToSend.push(docData)
    if (metaData[index]) {
      metaDataToSend.push({ Details: metaData[index] });
    } else {
      metaDataToSend.push(null)
    }
  });
  return {cellsData, docCommentsToSend, metaDataToSend};
};

export const getProductsNameKeyMap = (products) => {
  const productNameKey = {};
  products.map(
    (element) => (productNameKey[element["שם פריט"]] = element["מפתח פריט"])
  );
  return productNameKey;
};
