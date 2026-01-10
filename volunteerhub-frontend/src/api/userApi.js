import api from "./axios";

export const registerUser = (payload) =>
  api.post("/api/user/register", payload);

export const resetPasswordApi = (payload) =>
  api.post("/api/user/reset-password", payload);


// ✅ Get logged-in user's profile
export const getMyProfile = async () => {
  const emailId = localStorage.getItem("email");
  const res = await api.get(`/api/user/profile/${emailId}`);
  return res.data;
};

// ✅ Update profile
export const updateMyProfile = async (payload) => {
  const res = await api.put("/api/user/update", payload);
  return res.data;
};
