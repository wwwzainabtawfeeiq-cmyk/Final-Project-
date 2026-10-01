import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("bf_token") ||
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("تعذر الاتصال بالباكند");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("bf_token");
      localStorage.removeItem("token");
      localStorage.removeItem("bf_user");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default API;
export { API_URL };
