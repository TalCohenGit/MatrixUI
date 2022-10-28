import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import { axiosAuth } from "./axios";
import { getItemNames, parseStrimingData, formatDate } from "./utils/utils";

const getRecordsAPI = async (axiosPrivate, TID, sortKey) => {
  return await axiosPrivate.post("/api/getrecords", { TID, sortKey });
};

export const getDriverList = async (axiosPrivate) => {
  try {
    const res = await getRecordsAPI(axiosPrivate, "2", { "קוד מיון": "690" });
    const rawData = res.data.data;
    return (
      rawData?.length &&
      rawData.map((driver) => {
        return {
          name: driver["שם חשבון"],
          key: driver["מפתח"],
        };
      })
    );
  } catch (e) {
    console.log("error in getDriverList:", e);
  }
};

export const getCustomersAPI = async (axiosPrivate) => {
  try {
    const res = await getRecordsAPI(axiosPrivate, "2", { "קוד מיון": "300" });
    const rawData = res.data.data;

    return (
      rawData?.length &&
      rawData.map((customer) => {
        return {
          userName: customer["שם חשבון"],
          itemKey: customer["מפתח"],
          tel: customer["טלפון נייד"],
        };
      })
    );
  } catch (e) {
    console.log("error in getCustomersAPI: ", e);
  }
};

export const getProductsAPI = async (axiosPrivate, validationModal) => {
  try {
    const res = await getRecordsAPI(axiosPrivate, "1");
    const validationErrors = res.data.validationError;
    validationModal(validationErrors);
    const elements = res.data.data;
    return elements;
  } catch (e) {
    console.log("error in getProductsAPI:", e);
  }
};

export const getMatrixIDAPI = async (axiosPrivate) => {
  try {
    const res = await axiosPrivate.post("/api/generatekey");
    return res.data.key;
  } catch (e) {
    console.log("error in getMatrixIDAPI:", e);
  }
};

const getMatrixesDataObj = (
  matrixID,
  tableData,
  cellsData,
  docData,
  metaData,
  productsMap
) => {
  const { matrix, driverIDs, actionIDs, documentIDs, acountKeys } = tableData;
  const actionAutho = [];
  const documentIDsMock = [];
  for (var i = 0; i < driverIDs.length; i++) {
    actionAutho.push("Default");
    documentIDsMock.push(1);
  }
  const itemHeaders = matrix[0];

  return {
    mainMatrix: {
      matrixID,
      ActionID: 1,
      AccountKey: acountKeys,
      DocumentID: documentIDsMock,
      DriverID: driverIDs,
      ActionAutho: actionAutho,
      itemsHeaders: itemHeaders,
      itemsNames: getItemNames(itemHeaders, productsMap),
      cellsData: matrix.slice(1),
    },
    changesMatrix: {
      matrixConfig: null,
      matrixGlobalData: null,
      cellsData,
      docData,
      metaData,
    },
  };
};

export const createDocAPI = async (
  axiosPrivate,
  tableData,
  matrixID,
  cellsData,
  docData,
  metaData,
  productsMap,
  matrixName
) => {
  try {
    const matrixesData = getMatrixesDataObj(
      matrixID,
      tableData,
      cellsData,
      docData,
      metaData,
      productsMap
    );
    const date = formatDate(new Date())
    const isBI = true
    
    const dataToSend = getMatrixObject(date, matrixID, matrixesData, isBI, matrixName);
    console.log("dataToSend:", JSON.stringify(dataToSend));
    const res = await axiosPrivate.post("/api/createdoc", dataToSend);
    const parsedData = parseStrimingData(res.data);
    return parsedData;
  } catch (e) {
    console.log("error in createDocAPI:", e);
  }
};

const getMatrixObject = (date, matrixID, matrixesData, isBI, matrixName, matrixesUiData) => {
  return {
    matrixID,
    matrixName,
    matrixesData,
    matrixesUiData,
    Date: date,
    isBI,
    isInitiated: true
  };
};

export const saveTablesAPI = async (
  axiosPrivate,
  matrixID,
  tableData,
  matrixesUiData,
  cellsData,
  docData,
  metaData,
  isBI,
  date,
  matrixName,
  productsMap,
  isInitiated
) => {
  const matrixesData = getMatrixesDataObj(
    matrixID,
    tableData,
    cellsData,
    docData,
    metaData,
    productsMap
  );
  try {
    const res = await axiosPrivate.post("/api/savematrix", getMatrixObject(
      date,
      matrixID,
      matrixesData,
      isBI,
      matrixName,
      matrixesUiData,
      isInitiated
    ));
    return res;
  } catch (e) {
    console.log("error in saveTablesAPI: ", e);
  }
};

export const loginUserAPI = async (userEmail, password) => {
  try {
    const res = await axiosAuth.post("/api/login", {
      Mail: userEmail,
      userPassword: password,
    });
    return res.data.data;
  } catch (e) {
    console.log("error in loginUserAPI: ", e);
  }
};

export const registerAPI = async (
  firstName,
  lastName,
  phone,
  email,
  userPassword,
  accountName
) => {
  try {
    const res = await axiosAuth.post("/api/register", {
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      Mail: email,
      userPassword: userPassword,
      Accountname: accountName,
    });
    return res;
  } catch (e) {
    console.log("error in registerAPI: ", e);
  }
};

export const refreshTokenAPI = async (refreshToken) => {
  if (refreshToken) {
    try {
      const res = await axiosAuth.post("/api/refreshtoken", {
        token: refreshToken,
      });
      const data = res.data;
      return data.accessToken;
    } catch (e) {
      console.log("error in refreshTokenAPI: ", e);
    }
  } else {
    throw new Error("refreshTokenAPI: missing refreshToken");
  }
};

export const logoutAPI = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    return await axiosAuth.post("/api/logout", { token: refreshToken });
  } catch (e) {
    console.log("error in logoutAPI: ", e);
  }
};

export const getUrlsAPI = async (axiosPrivate, action) => {
  try {
    const res = await axiosPrivate.post("/api/getdata", {
      collection: "DocData",
      searchParams: { Action: action },
    });
    const data = res.data.result.data;
    return data.map((element) => {
      return {
        DocUrl: element["DocUrl"],
        DocNumber: element["DocNumber"],
      };
    });
  } catch (e) {
    console.log("error in createDocAPI:", e);
  }
};

export const deleteMatrixAPI = async (axiosPrivate, matrixID) => {
  try {
    await axiosPrivate.post("/api/deletedata", {
      collection: "MtxLog",
      indentifierValue: matrixID,
      indentifier: "matrixID"
    });
  } catch (e) {
    console.log("error in deleteMatrixAPI:", e)
  }

} 

export const mergePdfAPI = async (axiosPrivate, filteredUrl) => {
  try {
    const config = { responseType: "blob" };
    const file = await axiosPrivate.post("/api/mergepdfs", filteredUrl, config);
    return file.data;
  } catch (e) {
    console.log("error in mergePdfAPI:", e);
  }
};

export const getTablesByDatesAPI = async (axiosPrivate, fromDate, toDate) => {
  try {
    console.log("fromDate", fromDate)
    console.log("toDate", toDate)

    let dates = {
      Date: {
        $gte: fromDate,
        $lte: toDate,
      },
    };

    if (fromDate === toDate) {
      dates = {
        Date: {
          $gte: new Date(fromDate).setUTCHours(0, 0, 0, 0),
          $lte: new Date(toDate).setUTCHours(23, 59, 59, 999),
        },
      };
    }
    console.log("dates", dates)

    const res = await axiosPrivate.post("/api/getdata", {
      collection: "MtxLog",
      searchParams: dates,
    });

    const data = res.data.result.data;
    if (data?.length) {
      return data.map((element) => {
        return {
          matrixID: element.matrixID,
          matrixName: element.matrixName,
        };
      });
    }
  } catch (e) {
    console.log("error in getTablesByDatesAPI:", e);
  }
};

export const getMatrixByIDAPI = async (axiosPrivate, matrixID) => {
  try {
    const res = await axiosPrivate.post("/api/getdata", {
      collection: "MtxLog",
      searchParams: { matrixID: matrixID },
    });
    const data = res.data.result.data;
    if (data?.length) {
      return {
        matrixesUiData: JSON.parse(data[0]["matrixesUiData"]),
        isProduced: data[0]["isProduced"],
        matrixName: data[0]["matrixName"],
        date: data[0]["Date"],
        isBI: data[0]["isBI"]
      };
    }
  } catch (e) {
    console.log("error in getMatrixByIDAPI:", e);
  }
};

export const loadTablesAPI = async (axiosPrivate, userID) => {
  try {
    const res = await axiosPrivate.post("/api/loadmatrixes", {
      userID: userID,
    });
    const loadArr = res.data.result.data;
    const length = loadArr?.length;
    if (length) {
      const lastLoad = loadArr[length - 1];
      return {
        matrixID: lastLoad.matrixID,
        matrixName: lastLoad.matrixName,
        matrixesUiData: JSON.parse(lastLoad.matrixesUiData),
        saveData: new Date(lastLoad.createdAt),
        isProduced: lastLoad.isProduced,
        matrixDate: lastLoad.Date,
        isInitiated: lastLoad.isInitiated
      };
    }
  } catch (e) {
    console.log("error in loadTablesAPI: ", e);
  }
};
