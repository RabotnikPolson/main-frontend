import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const http = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: false,
});

try {
  const token = localStorage.getItem("accessToken");
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
} catch {}

http.interceptors.request.use(
  config => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {}
    return config;
  },
  err => Promise.reject(err)
);

http.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      console.warn("[HTTP 401]:", err?.config?.url);
    }
    return Promise.reject(err);
  }
);

export default http;
