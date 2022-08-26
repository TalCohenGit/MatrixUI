import { axiosAuth } from "./axios";

const getRecordsAPI = async (axiosPrivate, TID, sortKey) => {
  return await axiosPrivate.post(
    "/api/getrecords",
    { TID, sortKey },
  );
};

const getKeyAPI = async (axiosPrivate) => {
  // const headers = {
  //   "Content-Type": "application/json",
  // };
  const keyObj = await axiosPrivate.get("/api/generatekey")
  return keyObj.data.key;
}

const createDocAPI = async (axiosPrivate, body) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return await axiosPrivate.post(
    "/api/createdoc",
    { body },
    { headers }
  );
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
  console.log("getCustomersAPI")
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
    const validationErrors = res.data.validationError
    validationModal(validationErrors)
    const elements = JSON.parse(res.data.data);
    return elements;
  } catch (e) {
    console.log("error in getProductsAPI:", e);
  }
};

export const getMatrixIDAPI = async (axiosPrivate) => {
  try {
    // const key = await getKeyAPI(axiosPrivate);
    const key = "1234"

    return key;
  } catch (e) {
    console.log("error in getMatrixIDAPI:", e);
  }
};

export const sendTableAPI = async (axiosPrivate, tableData, matrixID, commentMatrix) => {
  const { matrix, driverIDs, actionIDs, documentIDs, acountKeys } = tableData
  const mainMatrix = {
    matrixesData: {
      matrixID: matrixID,
      AcountKeys: acountKeys,
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
    data: commentMatrix
  }
  try {
    const dataToSend = {mainMatrix, changedMatrix}
    console.log("dataToSend:", JSON.stringify(dataToSend))
    await createDocAPI(axiosPrivate, dataToSend);
  } catch (e) {
    console.log("error in sendTableAPI:", e);
  }
};

export const saveTablesAPI = (axiosPrivate, matrixID, UserID, matrixData, commentMatrix, drivers) => {
  const matrixes = [JSON.stringify(matrixData), JSON.stringify(commentMatrix), JSON.stringify(drivers)]
  //sending to server, need the new API
}

export const loadTablesAPI = (axiosPrivate, matrixID, UserID) => {
  // const matrixData = [["שם לקוח","מזהה","טלפון","הרנה 250 גרם","איסוף","מאושר","סוג מסמך","הערות למסמך",""],["גוגל google","7199","528124625",5,"6127",2,1,"הערה למסמך",0]]
  // const commentMatrix = [[[{"selectValue":"Quantity","inputValue":"1000"}],null,null,null,null]]
  // return {matrixData, commentMatrix}
}

export const loginUserAPI = async(userEmail, password) => {
  const res = await axiosAuth.post(
    "/api/login",
    {Mail: userEmail, userPassword: password},
  );
  return res.data.data
}

export const registerAPI = () => {
  // return {}
}

export const refreshTokenAPI = async (refreshToken) => {
  if (refreshToken) {
    try {
      return await axiosAuth.post(
        "/api/login",
        {token: refreshToken}
      )
    } catch (e){
      console.log("error in refreshTokenAPI: ", e)
    }
  } else {
    throw new Error("refreshTokenAPI: missing refreshToken")
  }
}

export const logoutAPI = async () => {
  const refreshToken = localStorage.getItem("refreshToken")
  try{
    return await axiosAuth.post(
      "/api/logout",
      {token: refreshToken})
  } catch (e) {
    console.log("error in logoutAPI: ", e)
  }
}

