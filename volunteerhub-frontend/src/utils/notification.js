export const getNotifications = () => {
  return JSON.parse(localStorage.getItem("notifications") || "[]");
};

export const addNotification = (message) => {
  const old = getNotifications();
  const updated = [
    {
      id: Date.now(),
      message,
      time: new Date().toLocaleString(),
    },
    ...old,
  ];
  localStorage.setItem("notifications", JSON.stringify(updated));
};

export const clearNotifications = () => {
  localStorage.removeItem("notifications");
};
