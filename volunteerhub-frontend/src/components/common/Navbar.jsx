import { Bell, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../utils/notificationStore";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { notifications, clearNotifications } =
    useNotificationStore();

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow">
      <h1 className="text-xl font-bold">VolunteerHub</h1>

      <div className="relative flex items-center gap-5">
        {/* 🔔 NOTIFICATION BELL */}
        <button
          onClick={() => setOpen(!open)}
          className="relative"
        >
          <Bell className="h-6 w-6 text-gray-700" />

          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {/* 🔔 DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-10 w-80 bg-white border rounded-xl shadow-lg z-50">
            <div className="p-3 font-semibold border-b">
              Notifications
            </div>

            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                No notifications
              </p>
            ) : (
              <ul className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="p-3 border-b text-sm"
                  >
                    <p>{n.message}</p>
                    <span className="text-xs text-gray-400">
                      {n.time}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={clearNotifications}
              className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 👤 PROFILE */}
        <button onClick={() => navigate("/profile")}>
          <User className="h-6 w-6 text-gray-700" />
        </button>

        {/* 🚪 LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="h-6 w-6 text-rose-600" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
