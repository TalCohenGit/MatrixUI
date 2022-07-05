import axios from "axios";
import constants from "./constants.js";

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
}

const createDocAPI = async (body) => {
  const headers = {
    "Content-Type": "application/json"
  };

  return await axios.post(
    constants.SERVER_NAME + "/api/createdoc",
    { body },
    { headers }
  );
}

export const getDriverList = async() => {
  try {
    const res = await getRecordsAPI("2", {"קוד מיון": "690"})
    const rawData = JSON.parse(res.data.data);
    return rawData?.length && rawData.map((driver) => driver["שם חשבון"]);   
  } catch (e) {
    console.log("error in getDriverList:", e)
  }
  
};

export const getCustomersAPI = async () => {
  try {
    const res = await getRecordsAPI("2")
    const rawData = JSON.parse(res.data.data);

    return rawData?.length && rawData.map((customer) => {
      return {
        userName: customer["שם חשבון"],
        itemKey: customer["מפתח"],
        tel: customer["טלפון נייד"],
      };
    });
  } catch (e) {
    console.log("error in getCustomersAPI: ", e);
  }
};

export const getProductsAPI = async(arr) => {
  try {
    const res = await getRecordsAPI("1")
    const elements =  JSON.parse(res.data.data)
    return elements
  } catch(e){
    console.log("error in getProductsAPI:", e)
  }
  
};

export const sendTableAPI = async(table) => {
  console.log("sendTableAPI", table)
  try {
    await createDocAPI(table)
  } catch(e) {
    console.log("error in sendTableAPI:", e)
  }
}
