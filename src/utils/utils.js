import { numOfColBeforeProducts, numOfColAfterProducts } from "./constants";
import _ from "lodash"

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

export const createBalanceTable = (data) => {
  if(!data.length){
    return
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
      null
    ];
    currentBalanceData.push(tableRowData);
  });
  return currentBalanceData;
};

export const updateBalanceTable = (productsNames, productsData) => {   
  const selectedProducts = productsData.filter(product => productsNames.includes(product["שם פריט"]))
  return createBalanceTable(selectedProducts)
}

export const getUniqProducts = (productsData) => {
   return _.uniqBy(productsData, "שם פריט")
}

const validateValueExist = (valueToCheck, setComment) => {
  if(!valueToCheck) {
    setComment()
  }
}

export const handleMatrixData = (tableData, productsMap, setCustomerValidationFailed) => {
  let matrix = JSON.parse(JSON.stringify(tableData));
  const titleLength = matrix[0].length;
  let tableDetails = matrix.slice(1);
  const acountKeys = []
  const metaData = [];
  const documentIDs = [];
  const actionIDs = [];
  const driverIDs = [];
  const docComments = [];
  tableDetails = tableDetails.map((rowData) => {
    acountKeys.push(rowData[1])
    metaData.push(rowData.pop())
    docComments.push(rowData.pop());
    const docId = rowData.pop()
    documentIDs.push(docId);
    const actionID = rowData.pop()
    actionIDs.push(actionID);
    const driverID = rowData.pop()
    if (!driverID || !actionID || !docId){
      const customerName = rowData[0]
      setCustomerValidationFailed(customerName)
      return;
    }
    driverIDs.push(driverID);
    return [rowData.slice(3)]
    });

  if(!driverIDs.length){
    return
  }
  
  const products = matrix[0].slice(
    numOfColBeforeProducts,
    titleLength - numOfColAfterProducts
  );
  const productsWithKeys = products.map((element) => productsMap[element]);
  matrix = [productsWithKeys, ...tableDetails];
  return { matrix, driverIDs, actionIDs, documentIDs, docComments, acountKeys, metaData };
};

export const handleCommentMatrixData = (matrixComments, docComments, metaData) => {
  const matrixCommentToSend = []
  matrixComments.forEach((commentsRow, index) => {
    let cellsData = [];
    commentsRow.forEach((comments) => {
      if (!comments) {
        cellsData.push(null);
      } else {
        const commentsObj = {};
        comments.forEach(
          (comment) =>
            (commentsObj[comment["selectValue"]] = comment["inputValue"])
        );
        cellsData.push(commentsObj);
      }
    });
    const docData = !docComments[index]? null : docComments[index]
    const matrixCommentRow = {"cellsData": cellsData, "docData": docData}
    if(metaData[index]) {
      matrixCommentRow["metaData"] = {"Details": metaData[index]}
    }
    matrixCommentToSend.push(matrixCommentRow)
  });
  return matrixCommentToSend
};

export const getProductsNameKeyMap = (products) => {
  const productNameKey = {};
  products.map(
    (element) => (productNameKey[element["שם פריט"]] = element["מפתח פריט"])
  );
  return productNameKey;
};
