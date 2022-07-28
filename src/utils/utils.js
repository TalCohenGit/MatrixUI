import { numOfColBeforeProducts, numOfColAfterProducts } from "./constants";

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
    ];
    currentBalanceData.push(tableRowData);
  });
  return currentBalanceData;
};

export const handleMatrixData = (tableData, productsMap) => {
  let matrix = JSON.parse(JSON.stringify(tableData));
  const titleLength = matrix[0].length;
  const products = matrix[0].slice(
    numOfColBeforeProducts,
    titleLength - numOfColAfterProducts
  );
  const productsWithKeys = products.map((element) => productsMap[element]);
  let tableDetails = matrix.slice(1);
  const metaData = [];
  const documentIDs = [];
  const actionIDs = [];
  const driverIDs = [];
  const docComments = [];
  tableDetails.map((rowData) => {
    docComments.push(rowData.pop());
    metaData.push(rowData.pop());
    documentIDs.push(rowData.pop());
    actionIDs.push(rowData.pop());
    driverIDs.push(rowData.pop());
  });
  matrix = [productsWithKeys, ...tableDetails];
  matrix[0].unshift("AcountName", "AountKey", "CellPhone");
  return { matrix, driverIDs, actionIDs, documentIDs, metaData, docComments };
};

export const handleChangedMatrixData = (matrixComments, docComments) => {
  console.log(" handleChangedMatrixDatamatrixComments and docComments", matrixComments, docComments);
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
    console.log("cellsData:", cellsData)
    const docData = !docComments[index]? null : docComments[index]
    matrixCommentToSend.push({"cellsData": cellsData, "docData": docData})
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
