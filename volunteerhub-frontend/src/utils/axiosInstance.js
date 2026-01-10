import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

// 🔐 Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ CORRECT KEY
    if (token) {
      config.headers["X-Auth-Token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Optional: global 401 handling (recommended)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
