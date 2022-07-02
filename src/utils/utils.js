export const filterCustomers = (parsedName, input) => {
  return input.length && parsedName?.length && parsedName.includes(input);
};

export const mapTable = (data, key,headerName) =>
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
