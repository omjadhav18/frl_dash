import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from "./auth";
import { BASE_URL } from "./constants";
import Cookies from "js-cookie";

const useAxios = (): AxiosInstance => {
  const access_token: string | undefined = Cookies.get("access_token");
  const refresh_token: string | undefined = Cookies.get("refresh_token");

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
    },
  });

  axiosInstance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
    if (!access_token || !isAccessTokenExpired(access_token)) {
      return req;
    }

    const response = await getRefreshToken();
    setAuthUser(response.access, response.refresh);

    if (req.headers) {
      req.headers.Authorization = `Bearer ${response.access}`;
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
