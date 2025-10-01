import axios from "axios";

function normalizeBaseUrl(url: string) {
  // Remove trailing slash to avoid double slashes when joining paths
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

console.log(import.meta.env.VITE_API_BASE_URL);

const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const axiosInstance = axios.create({
  baseURL: normalizeBaseUrl(String(rawBase)),
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
