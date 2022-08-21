import axios from "axios";
import { SERVER_NAME } from "./utils/constants";

const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer 1111",
  };
export const axiosPrivate = axios.create({
    baseURL: SERVER_NAME,
    headers
    // withCredentials: true
  });

  