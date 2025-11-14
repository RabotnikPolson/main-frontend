import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const http = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: false
});

// начальная установка токена
try {
  const t = localStorage.getItem("token");
  if (t) http.defaults.headers.common["Authorization"] = `Bearer ${t}`;
} catch {}

// перехватчик запросов
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// обработка ошибок
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("[HTTP 401]:", err?.config?.url);
    }
    return Promise.reject(err);
  }
);

export default http;
