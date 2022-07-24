import axios from "axios";
import constants from "./constants.js";
import { handleData } from "./utils/utils.js";

const getRecordsAPI = async (TID, sortKey) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer 1111",
  };

  return await axios.post(
    constants.SERVER_NAME + "/api/getrecords",
    { TID, sortKey },
    { headers }
  );
};

const createDocAPI = async (body) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return await axios.post(
    constants.SERVER_NAME + "/api/createdoc",
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

export const getProductsAPI = async (arr) => {
  try {
    const res = await getRecordsAPI("1");
    const elements = JSON.parse(res.data.data);
    return elements;
  } catch (e) {
    console.log("error in getProductsAPI:", e);
  }
};

const getMatrixIDAPI = async () => {
  try {
    await getRecordsAPI("1");
    return "1234";
  } catch (e) {
    console.log("error in getMatrixIDAPI:", e);
  }
};

export const sendTableAPI = async (tableData, productsMap) => {
  console.log("sendTableAPI", tableData);
  const { matrix, driverIDs, actionIDs, documentIDs, metaData } = handleData(
    tableData,
    productsMap
  );
  const matrixID = await getMatrixIDAPI();
  console.log(
    "matrix,driverId,actionId, matrixID, documentID, metaData:",
    matrix,
    driverIDs,
    actionIDs,
    matrixID,
    documentIDs,
    metaData
  );
  const mainMatrix = {
    matrixesData: {
      matrixID: matrixID,
      DefaultDocID: 1,
      DocumentID: documentIDs,
      DefaultDriver: "PickUp",
      DriverID: driverIDs,
      ActionID: actionIDs,
      ActionAutho: ["Default", "Default", "Default", "Default", "Default"],
    },
    data: matrix,
  };


  try {
    await createDocAPI(tableData);
  } catch (e) {
    console.log("error in sendTableAPI:", e);
  }
};
