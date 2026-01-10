export const pushNotification = (message) => {
  const existing = JSON.parse(
    localStorage.getItem("notifications") || "[]"
  );

  existing.unshift({
    message,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem("notifications", JSON.stringify(existing));
};
