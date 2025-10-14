import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

// Safely get tokens from cookies
const access_token: string | undefined = Cookies.get("access_token");
const refresh_token: string | undefined = Cookies.get("refresh_token");

console.log("Access Token:", access_token);

const apiInstanceAuth: AxiosInstance = axios.create({
  baseURL: "https://frl-server.onrender.com/api/v1/",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
  },
});

export default apiInstanceAuth;
