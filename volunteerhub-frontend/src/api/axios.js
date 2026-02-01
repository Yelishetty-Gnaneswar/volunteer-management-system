import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.https://volunteerhub-backend.onrender.com, // ✅ FIXED (ONLY CHANGE)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    config.headers["sessionId"] = sessionId; // ✅ FINAL (unchanged)
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
