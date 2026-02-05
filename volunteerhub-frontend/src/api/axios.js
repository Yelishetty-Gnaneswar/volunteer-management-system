import axios from "axios";

/*
  ✅ Correct backend selection
*/
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://volunteer-management-system-isp4.onrender.com");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // we use sessionId header
});

/* ===== REQUEST INTERCEPTOR ===== */
api.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      config.headers["sessionId"] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===== RESPONSE INTERCEPTOR ===== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;
