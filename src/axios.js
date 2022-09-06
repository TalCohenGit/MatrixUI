import axios from "axios";

const matrixServerURL =  process.env.REACT_APP_MATRIX_URL
const authServerURL = process.env.REACT_APP_AUTH_URL
console.log("authServerURL", authServerURL)

const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer 1111",
};
export const axiosPrivate = axios.create({
  baseURL: matrixServerURL,
  headers,
});

const authHeaders = {
  "Content-Type": "application/json",
};
export const axiosAuth = axios.create({
  baseURL: authServerURL,
  authHeaders,
});
