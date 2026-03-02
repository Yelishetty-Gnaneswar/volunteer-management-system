import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotificationStore } from "../utils/notificationStore";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ title, children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout: authLogout } = useAuth();

  const notifications = useNotificationStore(
    (state) => state.notifications
  );
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications
  );

  const logout = () => {
    authLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* TOP BAR */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        {/* BRAND */}
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-600">
            Volunteer<span className="text-gray-800">Hub</span>
          </h1>
          <p className="text-sm text-gray-500">{title}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-5 relative">
          {/* 🔔 Notification Bell */}
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1">
                {notifications.length}
              </span>
            )}
          </button>

          {/* 🔽 Notification Dropdown */}
          {open && (
            <div className="absolute right-14 top-12 w-80 bg-white shadow-xl rounded-xl border z-50">
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <span className="font-semibold">Notifications</span>
                <button
                  onClick={clearNotifications}
                  className="text-xs text-indigo-600"
                >
                  Clear
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  No notifications
                </p>
              ) : (
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`px-4 py-3 border-b text-sm hover:bg-gray-50 ${!n.read ? "bg-indigo-50 font-medium" : ""
                        }`}
                    >
                      <p>{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* PROFILE */}
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <User className="w-5 h-5 text-gray-700" />
          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm text-rose-600 hover:underline"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
