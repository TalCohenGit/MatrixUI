import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import { axiosAuth, axiosPrivate } from "./axios";
import axios from "axios";

const getRecordsAPI = async (axiosPrivate, TID, sortKey) => {
  return await axiosPrivate.post("/api/getrecords", { TID, sortKey });
};

export const getDriverList = async (axiosPrivate) => {
  try {
    const res = await getRecordsAPI(axiosPrivate, "2", { "קוד מיון": "690" });
    const rawData = JSON.parse(res.data.data);
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
    const rawData = JSON.parse(res.data.data);

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
    const elements = JSON.parse(res.data.data);
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
  metaData
) => {
  const { matrix, driverIDs, actionIDs, documentIDs, acountKeys } = tableData;
  const actionAutho = [];
  const documentIDsMock = [];
  for (var i = 0; i < driverIDs.length; i++) {
    actionAutho.push("Default");
    documentIDsMock.push(1);
  }

  return {
    mainMatrix: {
      matrixID: matrixID,
      ActionID: 1,
      AccountKey: acountKeys,
      DocumentID: documentIDsMock,
      DriverID: driverIDs,
      ActionAutho: actionAutho,
      itemsHeaders: matrix[0],
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
  metaData
) => {
  try {
    const matrixesData = getMatrixesDataObj(
      matrixID,
      tableData,
      cellsData,
      docData,
      metaData
    );
    const dataToSend = { matrixesData };
    console.log("dataToSend:", JSON.stringify(dataToSend));
    // const headers = {
    //   "Content-Type": "application/json",
    //   Authorization:
    //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZXRjaGVkRGF0YSI6eyJzdGF0dXMiOiJ5ZXMiLCJjb25maWdPYmoiOnsidXNzZXJJRCI6eyJyZXF1aXJlZCI6dHJ1ZX0sIkRlZmF1bHREcml2ZXIiOnsiaXNEZWZhdWx0IjpmYWxzZX0sIkRvY3VtZW50RGVmIjp7ImlzRGVmYXVsdCI6dHJ1ZSwiRG9jdW1lbnREZWYiOjEsImlzRmlyc3QiOmZhbHNlfSwiUHJlbWlzc2lvbk10eCI6eyJkb2NMaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6NTB9LCJzdW1MaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6MjAwMDB9LCJ0YXhEb2NzIjp0cnVlLCJSZWZ1bmQiOnsiaXNBbGxvdyI6ZmFsc2V9LCJEaXNjb3VudCI6eyJpc0FsbG93Ijp0cnVlLCJpc0xpbWl0ZWQiOmZhbHNlfSwiT2JsaWdvUGFzcyI6eyJpc0FsbG93IjpmYWxzZX0sIkZsYWdlZENhc3R1bWVycyI6eyJpc0FsbG93IjpmYWxzZX19fSwidXNlcklEIjoiNjJmZDBjZWVlZGJjODdiYWYzOTc5NzU3In0sImlhdCI6MTY2MjAyMjU1OX0.eACq69czOOlYd0Y8yDNszPylA-uHdsuujJU1A-KUmp4",
    // };
    // const axiosPrivate = axios.create({
    //   baseURL: "http://localhost:4001",
    //   headers,
    // });
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
  console.log("matrixesData is: ", matrixesData)
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
      console.log("refreshtoken data", data)
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
    return urls.slice(urls.length - 10, urls.length);
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
