import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import { axiosAuth } from "./axios";

const getRecordsAPI = async (axiosPrivate, TID, sortKey) => {
  return await axiosPrivate.post("/api/getrecords", { TID, sortKey });
};

const createDocAPI = async (axiosPrivate, body) => {
  return await axiosPrivate.post("/api/createdoc", { body });
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
  console.log("getCustomersAPI");
  try {
    const res = await getRecordsAPI(axiosPrivate, "2");
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

export const getMatrixIDAPI = async (axiosPrivate, userEmail, userPassword) => {
  try {
    const res = await axiosPrivate.post("/api/generatekey", {
      Mail: userEmail,
      userPassword: userPassword,
    });
    console.log("res:", res);
    console.log(" res.data.ke", res.data.key);
    return res.data.key;
  } catch (e) {
    console.log("error in getMatrixIDAPI:", e);
  }
};

export const sendTableAPI = async (
  axiosPrivate,
  tableData,
  matrixID,
  commentMatrix
) => {
  const { matrix, driverIDs, actionIDs, documentIDs, acountKeys } = tableData;
  const mainMatrix = {
    matrixesData: {
      matrixID: matrixID,
      AccountKey: acountKeys,
      DocumentID: documentIDs,
      DriverID: driverIDs,
      ActionID: actionIDs,
      ActionAutho: ["Default", "Default", "Default", "Default", "Default"],
    },
    data: matrix,
  };

  const changedMatrix = {
    matrixConfig: null,
    matrixGlobalData: null,
    data: commentMatrix,
  };
  try {
    const dataToSend = { mainMatrix, changedMatrix };
    console.log("dataToSend:", JSON.stringify(dataToSend));
    await createDocAPI(axiosPrivate, dataToSend);
  } catch (e) {
    console.log("error in sendTableAPI:", e);
  }
};

export const saveTablesAPI = async (
  axiosPrivate,
  matrixID,
  userID,
  matrixData,
  commentMatrix,
) => {
  const matrixes = [
    JSON.stringify(matrixData),
    JSON.stringify(commentMatrix)
  ];
  localStorage.setItem("userID", 
  userID
)
localStorage.setItem("matrixID", 
matrixID
)
  console.log("saveTablesAPI", matrixes);
  localStorage.setItem("test3", JSON.stringify(matrixes))
  try {
    const res = await axiosPrivate.post("/api/savematrix", {
      matrixID,
      userID: userID,
      matrixesData: matrixes,
    });
    return res;
  } catch (e) {
    console.log("error in saveTablesAPI: ", e);
  }
};

export const loadTablesAPI = async (axiosPrivate, userID) => {
  try {
    console.log("loadTablesAPI userID: ", userID);
    console.log("loadTablesAPI axiosPrivate: ", axiosPrivate);

    const res = await axiosPrivate.post("/api/loadmatrixes", {
      userID: userID,
    });
    console.log("loadTablesAPI res: ", res);
    const loadArr = res.data.result.data;
    console.log("loadTablesAPI loadArr: ", loadArr);
    const length = loadArr?.length;
    if (length) {
      const lastLoad = loadArr[length - 1];
      return {matrixesData: lastLoad.matrixesData, matrixID: lastLoad.matrixID};
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
      const res = await axiosAuth.post("/api/refreshtoken", { token: refreshToken });
      console.log("refreshTokenAPI res:", res)
      const data = res.data
      console.log("refreshTokenAPI data:", data)
      console.log("refreshTokenAPI accessToken:", data.accessToken)
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
