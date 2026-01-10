import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  /* ---------------- STATE ---------------- */
  notifications: [],

  /* ---------------- ADD (BACKWARD COMPATIBLE) ---------------- */
  addNotification: (msg) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),               // unique id
          message: typeof msg === "string" ? msg : msg.message,
          read: false,
          createdAt: new Date(),
        },
        ...state.notifications,
      ],
    })),

  /* ---------------- MARK AS READ ---------------- */
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  /* ---------------- CLEAR ---------------- */
  clearNotifications: () => set({ notifications: [] }),

  /* ---------------- HELPERS ---------------- */
  unreadCount: () =>
    get().notifications.filter((n) => !n.read).length,
}));
