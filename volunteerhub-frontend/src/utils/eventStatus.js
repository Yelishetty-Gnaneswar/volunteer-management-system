export const getEventStatus = (event) => {
  if (!event?.startDate || !event?.endDate) {
    return "UPCOMING"; // safe fallback
  }

  const today = new Date().toISOString().split("T")[0];
  const start = event.startDate;
  const end = event.endDate;

  if (start > today) return "UPCOMING";
  if (start <= today && end >= today) return "ONGOING";
  return "COMPLETED";
};
