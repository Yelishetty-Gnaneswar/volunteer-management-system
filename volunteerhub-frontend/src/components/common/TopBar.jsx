import { useState } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { markAllRead } from "../../utils/notificationStore";

const TopBar = ({ profile, notifications }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    setOpen(prev => !prev);
    if (unreadCount > 0) {
      markAllRead();
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="relative flex items-center gap-6">
      {/* 🔔 Notifications */}
      <div
        className="relative cursor-pointer"
        onClick={handleBellClick}
      >
        <Bell className="h-6 w-6 text-gray-600 hover:text-gray-900" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {/* 👤 Profile */}
      <div
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <User className="h-8 w-8 bg-gray-100 p-1 rounded-full" />
        <span className="font-medium hidden sm:block">
          {profile.name}
        </span>
      </div>

      {/* ⎋ Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:block">Logout</span>
      </button>

      {/* 🔔 Notification Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border z-50"
          >
            <div className="p-4 border-b font-semibold">
              Notifications
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 text-center">
                  No notifications
                </p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 text-sm border-b ${
                      n.read ? "bg-white" : "bg-indigo-50"
                    }`}
                  >
                    <p className="text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {n.time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopBar;
