export const logout = () => {
  localStorage.removeItem("sessionId");
  localStorage.removeItem("role");
};
