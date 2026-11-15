import axios from "axios";
import Cookies from "js-cookie";

const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    const envUrl = process.env.REACT_APP_API_URL;
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
    }
    const protocol = window.location.protocol || "http:";
    return `${protocol}//${hostname}:8089/api`;
  }
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
  }
  return "http://localhost:8089/api";
};

const superadminApi = axios.create({
  baseURL: `${getApiBaseUrl()}/superadmin`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach SuperAdmin Bearer token
superadminApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("superadmin_token") || localStorage.getItem("superadmin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
superadminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      Cookies.remove("superadmin_token");
      localStorage.removeItem("superadmin_token");
      localStorage.removeItem("superadmin_user");
      if (window.location.pathname.startsWith("/superadmin") && window.location.pathname !== "/superadmin/login") {
        window.location.href = "/superadmin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default superadminApi;
