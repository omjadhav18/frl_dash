import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const apiInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiInstance;
