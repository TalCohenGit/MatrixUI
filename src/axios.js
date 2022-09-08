import axios from "axios";

const matrixServerURL =  process.env.REACT_APP_MATRIX_URL
const authServerURL = process.env.REACT_APP_AUTH_URL
console.log("authServerURL", authServerURL)

const headers = {
  "Content-Type": "application/json",
  // Authorization: "Bearer 1111",
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZXRjaGVkRGF0YSI6eyJzdGF0dXMiOiJ5ZXMiLCJjb25maWdPYmoiOnsidXNzZXJJRCI6eyJyZXF1aXJlZCI6dHJ1ZX0sIkRlZmF1bHREcml2ZXIiOnsiaXNEZWZhdWx0IjpmYWxzZX0sIkRvY3VtZW50RGVmIjp7ImlzRGVmYXVsdCI6dHJ1ZSwiRG9jdW1lbnREZWYiOjEsImlzRmlyc3QiOmZhbHNlfSwiUHJlbWlzc2lvbk10eCI6eyJkb2NMaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6NTB9LCJzdW1MaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6MjAwMDB9LCJ0YXhEb2NzIjp0cnVlLCJSZWZ1bmQiOnsiaXNBbGxvdyI6ZmFsc2V9LCJEaXNjb3VudCI6eyJpc0FsbG93Ijp0cnVlLCJpc0xpbWl0ZWQiOmZhbHNlfSwiT2JsaWdvUGFzcyI6eyJpc0FsbG93IjpmYWxzZX0sIkZsYWdlZENhc3R1bWVycyI6eyJpc0FsbG93IjpmYWxzZX19fSwidXNlcklEIjoiNjJmZDBjZWVlZGJjODdiYWYzOTc5NzU3In0sImlhdCI6MTY2MjAyMjU1OX0.eACq69czOOlYd0Y8yDNszPylA-uHdsuujJU1A-KUmp4",

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
  mode:'no-cors'
});
