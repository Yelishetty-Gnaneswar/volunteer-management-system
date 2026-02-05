import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    config.headers["sessionId"] = sessionId; // ✅ FINAL
  }
  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Session expired");

      localStorage.removeItem("sessionId");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }

    return Promise.reject(error);
  }
);

export default api;