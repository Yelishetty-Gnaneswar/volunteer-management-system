import api from "./axios";
import axios from "axios";

/* ================= ORGANIZER ================= */

export const getOrganizerEvents = async () => {
  const [upcoming, ongoing, completed] = await Promise.all([
    api.get("/event/list/status/UPCOMING"),
    api.get("/event/list/status/ONGOING"),
    api.get("/event/list/status/COMPLETED"),
  ]);

  return [
    ...(upcoming.data || []),
    ...(ongoing.data || []),
    ...(completed.data || []),
  ];
};

export const createEvent = async (eventData) => {
  const res = await api.post("/event/create", eventData);
  return res.data;
};

export const updateEvent = async (payload) => {
  const sessionId = localStorage.getItem("sessionId");

  if (!sessionId) throw new Error("Session expired");

  const res = await api.put(
    "/event/update",
    payload,
    {
      headers: { sessionId },
    }
  );

  return res.data;
};

export const deleteEvent = async (eventId) => {
  const res = await api.delete(`/event/delete/${eventId}`);
  return res.data;
};

/* ================= PARTICIPANTS (✅ FIXED) ================= */

export const getParticipants = async (eventId) => {
  const sessionId = localStorage.getItem("sessionId");

  if (!sessionId) throw new Error("Session expired");

  const res = await api.get(
    `/event/${eventId}/participants`,
    {
      headers: {
        sessionId,
      },
    }
  );

  return res.data;
};


/* ================= VOLUNTEER ================= */

export const registerEvent = async (eventId) => {
  const sessionId = localStorage.getItem("sessionId");

  console.log("REGISTER eventId =", eventId);
  console.log("REGISTER sessionId =", sessionId);

  if (!sessionId) throw new Error("Session expired");
  if (!eventId) throw new Error("eventId missing");

  const res = await axios({
    method: "post",
    url: "http://localhost:8080/event/register",
    headers: {
      "Content-Type": "application/json",
      sessionId: sessionId,
    },
    data: {
      eventId: Number(eventId),
    },
  });

  return res.data;
};

export const unregisterEvent = async (eventId) => {
  const sessionId = localStorage.getItem("sessionId");

  if (!sessionId) throw new Error("Session expired");
  if (!eventId) throw new Error("eventId missing");

  const res = await api.post(
    "/event/unregister",
    { eventId: Number(eventId) },
    { headers: { sessionId } }
  );

  return res.data;
};

/* ================= EVENT LIST ================= */

export const getUpcomingEvents = async () => {
  const res = await api.get("/event/list/status/UPCOMING");
  return res.data;
};

export const getOngoingEvents = async () => {
  const res = await api.get("/event/list/status/ONGOING");
  return res.data;
};

export const getCompletedEvents = async () => {
  const res = await api.get("/event/list/status/COMPLETED");
  return res.data;
};

/* ================= FEEDBACK ================= */

export const submitEventFeedback = async (payload) => {
  const emailId = localStorage.getItem("email");

  const res = await api.post("/event/feedback", {
    ...payload,
    emailId,
  });

  return res.data;
};

/* ================= CHECK-IN ================= */

export const checkInVolunteer = async ({ eventId, emailId }) => {
  const sessionId = localStorage.getItem("sessionId");

  if (!sessionId) throw new Error("Session expired");

  const res = await api.post(
    "/event/checkin",
    { eventId, emailId },
    { headers: { sessionId } }
  );

  return res.data;
};

/* ================= USER ================= */

export const updateMyProfile = async (payload) => {
  const res = await api.put("/api/user/update", payload);
  return res.data;
};

export const getMyProfile = async (emailId) => {
  const res = await api.get(`/api/user/profile/${emailId}`);
  return res.data;
};

export const getMyRegisteredEvents = async () => {
  const res = await api.get("/event/my-registrations");
  return res.data;
};
/* ================= EVENT BY ID (FIX FOR EDIT EVENT) ================= */

export const getEventById = async (eventId) => {
  const sessionId = localStorage.getItem("sessionId");

  if (!sessionId) throw new Error("Session expired");

  const res = await api.get(
    `/event/list/id/${eventId}`,
    {
      headers: { sessionId }
    }
  );

  return res.data;
};
const refresh = async (nextTab, registeredEventId = null) => {
  if (registeredEventId) {
    setMyMap((prev) => ({
      ...prev,
      [registeredEventId]: {
        registered: true,
        rating: null,
      },
    }));
  }

  if (nextTab) setActiveTab(nextTab);

  await loadMyEvents();
  await loadEvents();
};