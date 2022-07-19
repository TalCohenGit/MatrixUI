export const filterCustomers = (parsedName, input) => {
  return input.length && parsedName?.length && parsedName.includes(input);
};

export const mapTable = (data, key) =>
  data.map((element) => {
    if (key !== "מערך מאופס") {
      return element[key];
    } else {
      return 0 ;
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
      "",
      "",
      field.rowHeader,
      ...mapTable(data, field.rowKey),
      "",
      "",
    ];
    currentBalanceData.push(tableRowData);
  });
  return currentBalanceData;
};

export const handleData = (tableData, productsMap) => {
  let matrix = JSON.parse(JSON.stringify(tableData))
  const titleLength = matrix[0].length
  const products = matrix[0].slice(3, titleLength-2)
  const productsWithKeys = products.map(element => 
    productsMap[element]
  )
  let tableDetails = matrix.slice(1)
  const actionIDs = []
  const driverIDs = []
  tableDetails.map((rowData) => {
    actionIDs.push(rowData.pop())
    driverIDs.push(rowData.pop())
  })
  matrix = [productsWithKeys, ...tableDetails]
  matrix[0].unshift("AcountName", "AountKey", "CellPhone")
  return {matrix, driverIDs, actionIDs}
}

export const getProductsNameKeyMap = (products) => {
  const productNameKey = {}
  products.map((element) => productNameKey[element["שם פריט"]] = element["מפתח פריט"])
  return productNameKey
}