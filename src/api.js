import axios from "axios";
import { SERVER_NAME } from "./utils/constants";

const getRecordsAPI = async (TID, sortKey) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer 1111",
  };

  return await axios.post(
    SERVER_NAME + "/api/getrecords",
    { TID, sortKey },
    { headers }
  );
};

const getKeyAPI = async () => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer 1111",
  };
  const keyObj = await axios.get(SERVER_NAME + "/api/generatekey")
  return keyObj.data.key;
}

const createDocAPI = async (body) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return await axios.post(
    SERVER_NAME + "/api/createdoc",
    { body },
    { headers }
  );
};

export const getDriverList = async () => {
  try {
    const res = await getRecordsAPI("2", { "קוד מיון": "690" });
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

export const getCustomersAPI = async () => {
  try {
    const res = await getRecordsAPI("2");
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

export const getProductsAPI = async (arr, validationModal) => {
  try {
    const res = await getRecordsAPI("1");
    const validationErrors = res.data.validationError
    validationModal(validationErrors)
    const elements = JSON.parse(res.data.data);
    return elements;
  } catch (e) {
    console.log("error in getProductsAPI:", e);
  }
};

export const getMatrixIDAPI = async () => {
  try {
    // const key = await getKeyAPI();
    const key = "1234"

    return key;
  } catch (e) {
    console.log("error in getMatrixIDAPI:", e);
  }
};

export const sendTableAPI = async (tableData, matrixID, commentMatrix) => {
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
    await createDocAPI(dataToSend);
  } catch (e) {
    console.log("error in sendTableAPI:", e);
  }
};

export const saveTablesAPI = (matrixID, UserID, matrixData, commentMatrix, drivers) => {
  const matrixes = [JSON.stringify(matrixData), JSON.stringify(commentMatrix), JSON.stringify(drivers)]
  //sending to server, need the new API
}

export const loadTablesAPI = (matrixID, UserID) => {
  const matrixData = [["שם לקוח","מזהה","טלפון","הרנה 250 גרם","איסוף","מאושר","סוג מסמך","הערות למסמך",""],["גוגל google","7199","528124625",5,"6127",2,1,"הערה למסמך",0]]
  const commentMatrix = [[[{"selectValue":"Quantity","inputValue":"1000"}],null,null,null,null]]
  return {matrixData, commentMatrix}
}

