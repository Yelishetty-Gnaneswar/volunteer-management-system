import axios from "axios";

/*
  ✅ Automatically selects backend URL
  - Local development  → localhost
  - Production (Vercel) → Render backend
*/
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://volunteer-management-system-isp4.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

  // ❌ We are NOT using cookies
  // ✅ We use sessionId header instead
  withCredentials: false,
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      // ✅ REQUIRED for your backend
      config.headers["sessionId"] = sessionId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.warn("Session expired or unauthorized");

      localStorage.removeItem("sessionId");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }

    return Promise.reject(error);
  }
);

export default api;
