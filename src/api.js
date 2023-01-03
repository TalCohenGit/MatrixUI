import {
  axiosAuth,
  axiosRegister,
  axiosMsgs,
  axiosDrivers,
  matrixServerURL,
} from "./axios";
import {
  getItemNames,
  formatDateWhenSaving,
  getMatrixesDataObj
} from "./utils/utils";
import axios from "axios";

const getRecordsAPI = async (axiosPrivate, TID, sortKey) => {
  return await axiosPrivate.post("/api/getrecords", { TID, sortKey });
};

export const getDriversAPI = async () => {
  try {
    const res = await axios.get(
      "https://script.googleusercontent.com/macros/echo?user_content_key=w839cMrrTIPbioHkT5dAYxvxDnQL98PmiIUuoKNnmDa7a9tX1lCrTDPIzTjCx9l2fpegXX_dDEQLdEajOxBjnLjpzISNAAE_m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMn-AVuQdkoz4dmqGuvSPPzhahxZbFP7z80rUHEk_r8AqiYkD31LwkqTYQ85ycG6XdxQTipwiRHVDjfL4SbuQeXBIndAU2515A&lib=MLsM0LIWSq2RcZhKp-OZc4gfx44b5R80M"
    );
    return res.data.map((driver) => {
      return {
        name: driver["name"],
        key: driver["pivotKey"],
      };
    });
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

const getMatrixObject = (
  date,
  matrixID,
  matrixesData,
  isBI,
  matrixName,
  matrixesUiData,
  isInitiated
) => {
  return {
    matrixID,
    matrixName,
    matrixesData,
    matrixesUiData,
    Date: date,
    isBI,
    isInitiated,
  };
};

export const createDocAPI = async (
  axiosPrivate, 
  matrixID,
  matrixName,
  fileName,
  matrixesData
) => {
  try {

    const date = formatDateWhenSaving(new Date());
    const isBI = true;
    const dataToSend = getMatrixObject(
      date,
      matrixID,
      matrixesData,
      isBI,
      matrixName
    );
    const res = await axiosPrivate.post("/api/createdoc2", dataToSend, {
      headers: {
        fileName,
      },
    });
    // throw Error("error")
    return res;
  } catch (e) {
    console.log("error in createDocAPI:", e);
    throw Error(e);
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
  if (!matrixesData) {
    console.log("error in saveTablesAPI: ", "no matrixesData");
    return
  }
  try {
    const res = await axiosPrivate.post(
      "/api/savematrix",
      getMatrixObject(
        date,
        matrixID,
        matrixesData,
        isBI,
        matrixName,
        matrixesUiData,
        isInitiated
      )
    );
    return matrixID;
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
    const res = await axiosRegister.post("/api/Register", {
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      Mail: email,
      userPassword: userPassword,
      Accountname: accountName,
      isAdmin: "no",
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

export const getUrlsAPI = async (axiosPrivate, fileName) => {
  try {
    console.log("fileName.substring(2)", fileName.substring(2))
    const res = await axiosPrivate.post("/api/getdata", {
      collection: "DocData",
      searchParams: { Action: fileName.substring(2) },
    });
    const data = res.data.result.data;
    return data.map((element) => {
      const {
        DocUrl,
        DocNumber,
        Accountname,
        ValueDate,
        Action,
        TotalCost,
        DocumentDetails,
      } = element;
      return {
        DocUrl,
        Accountname,
        Action,
        ValueDate,
        TotalCost,
        DocNumber,
        DocumentDetails,
      };
    });
  } catch (e) {
    console.log("error in getUrlsAPI:", e);
  }
};

export const deleteMatrixAPI = async (axiosPrivate, matrixID) => {
  try {
    await axiosPrivate.post("/api/deletedata", {
      collection: "MtxLog",
      indentifierValue: matrixID,
      indentifier: matrixID,
    });
  } catch (e) {
    console.log("error in deleteMatrixAPI:", e);
  }
};

export const mergePdfAPI = async (axiosPrivate, filteredUrl) => {
  try {
    const config = { responseType: "blob" };
    const file = await axiosPrivate.post("/api/mergepdfs", filteredUrl, config);
    return file.data;
  } catch (e) {
    console.log("error in mergePdfAPI:", e);
  }
};

const getData = async (axiosPrivate, fromDate, toDate, collection, date) => {
  const dates = {
    [date]: {
      $gte: fromDate,
      $lte: toDate,
    },
  };

  return await axiosPrivate.post("/api/getdata", {
    collection: collection,
    searchParams: dates,
  });
};

export const getTablesByDatesAPI = async (axiosPrivate, fromDate, toDate) => {
  try {
    const res = await getData(axiosPrivate, fromDate, toDate, "MtxLog", "Date");

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

export const getUrlsByDatesAPI = async (axiosPrivate, fromDate, toDate) => {
  try {
    const res = await getData(
      axiosPrivate,
      fromDate,
      toDate,
      "DocData",
      "ValueDate"
    );

    const data = res.data.result.data;
    return data.map((element) => {
      const {
        DocUrl,
        DocNumber,
        Accountname,
        ValueDate,
        Action,
        TotalCost,
        DocumentDetails,
      } = element;
      return {
        DocUrl,
        Accountname,
        Action,
        ValueDate,
        TotalCost,
        DocNumber,
        DocumentDetails,
      };
    });
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
        isBI: data[0]["isBI"],
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
        isInitiated: lastLoad.isInitiated,
      };
    }
  } catch (e) {
    console.log("error in loadTablesAPI: ", e);
  }
};

export const sendMsgsAPI = async (numbers, msgs) => {
  try {
    await axiosMsgs.post("/api/sendMsgs", {
      password: "password",
      numbers: numbers,
      msg: msgs,
    });
  } catch (e) {
    console.log("error in sendMsgsAPI: ", e);
  }
};

export const getProgressBarAPI = async (axiosPrivate, fileName) => {
  try {
    return await fetch(`${matrixServerURL}api/getProgressBar`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        fileName,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        mode: "no-cors",
        timeLimit: 500,
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.log("error in getProgressBarAPI: ", e);
  }
};
