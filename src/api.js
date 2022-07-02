import axios from "axios";
import constants from "./constants.js";

const getRecordsAPI = async (TID) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer 1111",
  };

  return await axios.post(
    constants.SERVER_NAME + "/api/getrecords",
    { TID },
    { headers }
  );
}

export const getCustomersAPI = async () => {
  try {
    const res = await getRecordsAPI("2")
    const rawData = JSON.parse(res.data.data).repdata;

    return rawData.map((customer) => {
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

export const getDriverList = () => {
  return ["איציק", "דני", "משה"];
};
