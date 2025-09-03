import axios from "axios";
import { getToken } from "./auth";

const api = axios.create();

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Zone =
      sessionStorage.getItem("zn") || localStorage.getItem("zone") || "4";
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      sessionStorage.removeItem("zn");
      window.location.href = "/login"; // Redirect to login if you have one
    }
    return Promise.reject(error);
  }
);

export default api;