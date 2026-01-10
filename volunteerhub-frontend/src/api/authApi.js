import api from "./axios";

export const loginApi = (payload) => {
  return api.post("/api/auth/login", payload);
};
