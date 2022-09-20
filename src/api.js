
import { axiosAuth } from "./axios";
import { getItemNames } from "./utils/utils"

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
  const itemHeaders = matrix[0]

  return {
    mainMatrix: {
      matrixID: matrixID,
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

export const sendTableAPI = async (
  axiosPrivate,
  tableData,
  matrixID,
  cellsData,
  docData,
  metaData,
  productsMap
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
    const dataToSend = { matrixesData };
    console.log("dataToSend:", JSON.stringify(dataToSend));
    return await axiosPrivate.post("/api/createdoc", { matrixesData });
  } catch (e) {
    console.log("error in sendTableAPI:", e);
  }
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
  matrixName
) => {
  const matrixesData = getMatrixesDataObj(
    matrixID,
    tableData,
    cellsData,
    docData,
    metaData
  );
  try {
    const res = await axiosPrivate.post("/api/savematrix", {
      matrixID,
      matrixName,
      matrixesData,
      matrixesUiData,
      Date: date,
      isBI,
    });
    return res;
  } catch (e) {
    console.log("error in saveTablesAPI: ", e);
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
        matrixesUiData: JSON.parse(JSON.parse(lastLoad.matrixesUiData))
      };
    }
  } catch (e) {
    console.log("error in loadTablesAPI: ", e);
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

export const getUrlsAPI = async (axiosPrivate, userID) => {
  try {
    const res = await axiosPrivate.post("/api/loadDocUrls", { UserID: userID });
    const data = res.data.result.data;
    const urls = data.map((element) => element["DocUrl"]);
    return urls
  } catch (e) {
    console.log("error in sendTableAPI:", e);
  }
};

export const loadTablesByDatesAPI = async(axiosPrivate, fromDate, toDate) => {
  try {
    let dates = {"Date": {
      "$gte": fromDate,
      "$lte": toDate
    }}
    
    if (fromDate=== toDate) {
      dates = {"Date": toDate}
    }

    const res = await axiosPrivate.post("/api/getdata", 
    { collection: "MtxLog", "searchParams": dates});
    
    const data = res.data.result.data;
    if (data?.length) {
      return data.map((element) => {
        return {
          matrixID: element.matrixID,
          matrixName: element.matrixName
        };
      })
    }
  } catch (e) {
    console.log("error in loadAllTablesAPI:", e);
  }
}

export const loadAllTablesAPI = async (axiosPrivate, matrixID) => {
  try {
    const res = await axiosPrivate.post("/api/getdata", { collection: "MtxLog", "searchParams": {"matrixID": matrixID} });
    const data = res.data.result.data;
    if (data?.length) {
      return JSON.parse(JSON.parse(data[0]["matrixesUiData"]))
    }
  } catch (e) {
    console.log("error in loadAllTablesAPI:", e);
  }
}
