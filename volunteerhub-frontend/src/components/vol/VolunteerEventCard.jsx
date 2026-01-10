import { useState } from "react";
import { toast } from "react-toastify";
import { registerEvent, unregisterEvent } from "../../api/eventApi";
import EventFeedback from "./EventFeedback";
import { Calendar, MapPin } from "lucide-react";
import { useNotificationStore } from "../../utils/notificationStore";
import EventDonutAnalytics from "../charts/EventDonutAnalytics";
import { motion } from "framer-motion";

const VolunteerEventCard = ({
  event,
  isRegistered,
  existingRating,
  refresh,
  activeTab,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  /* ================= EVENT STATUS (DATE FIXED) ================= */
  const now = new Date();

  const start = new Date(event.startDate + "T00:00:00");
  const end = new Date(event.endDate + "T23:59:59");

  const isCompleted = now > end;
  const isOngoing = now >= start && now <= end;

  let mode = "UPCOMING";
  if (isOngoing) mode = "ONGOING";
  if (isCompleted) mode = "COMPLETED";

  /* ================= DATA ================= */
  const capacity = event.volunteersNeeded ?? 0;
  const registered = event.registeredCount ?? 0;
  const checkedIn = event.checkedInCount ?? 0;

  const safeRegistered = Math.min(registered, capacity);
  const safeCheckedIn = Math.min(checkedIn, safeRegistered);
  const remaining = Math.max(capacity - safeRegistered, 0);

  /* ================= ACTIONS ================= */
  const handleRegister = async () => {
    try {
      await registerEvent(event.eventId);
      toast.success("Registered successfully");
      refresh("MY");
      addNotification(`You registered for "${event.name}"`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleUnregister = async () => {
    try {
      await unregisterEvent(event.eventId);
      toast.success("Unregistered successfully");
      refresh("UPCOMING");
      addNotification(`You unregistered from "${event.name}"`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Unregister failed");
    }
  };

  return (
    <>
      {/* EVENT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        onClick={() => setShowAnalytics(true)}
        className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer"
      >
        {/* STATUS STRIP */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
            mode === "COMPLETED"
              ? "bg-gray-400"
              : mode === "ONGOING"
              ? "bg-amber-400"
              : isRegistered
              ? "bg-emerald-400"
              : "bg-sky-400"
          }`}
        />

        <div className="p-5 space-y-4">
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold">{event.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {event.description}
              </p>
            </div>

            {isRegistered && (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                Registered
              </span>
            )}
          </div>

          {/* INFO */}
          <div className="text-sm text-gray-600 space-y-2">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500" />
              {event.city}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-500" />
              {event.startDate} → {event.endDate}
            </p>
          </div>

          {/* ACTIONS */}
          <div
            className="space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {mode === "UPCOMING" && !isRegistered && (
              <button
                onClick={handleRegister}
                className="w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold"
              >
                Register
              </button>
            )}

            {mode === "UPCOMING" && isRegistered && (
              <button
                onClick={handleUnregister}
                className="w-full py-2 rounded-xl border border-rose-300 text-rose-600 font-semibold"
              >
                Unregister
              </button>
            )}

            {mode === "ONGOING" && (
              <button
                disabled
                className="w-full py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold"
              >
                Ongoing
              </button>
            )}

            {mode === "COMPLETED" && (
              <button
                disabled
                className="w-full py-2 rounded-xl bg-gray-100 text-gray-500 font-semibold"
              >
                Completed
              </button>
            )}

            {/* FEEDBACK */}
            {mode === "COMPLETED" &&
              isRegistered &&
              activeTab === "COMPLETED" &&
              (existingRating == null ? (
                <>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                  >
                    Give Feedback ⭐
                  </button>

                  {showFeedback && (
                    <EventFeedback
                      eventId={event.eventId}
                      onClose={() => {
                        setShowFeedback(false);
                        refresh();
                      }}
                    />
                  )}
                </>
              ) : (
                <span className="block text-center text-sm font-semibold text-emerald-600">
                  ⭐ Feedback Submitted
                </span>
              ))}
          </div>
        </div>
      </motion.div>

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-[520px] p-6 relative">
            <button
              onClick={() => setShowAnalytics(false)}
              className="absolute top-3 right-4 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-center mb-6">
              Event Analytics
            </h3>

            <div className="flex justify-center mb-6">
              <EventDonutAnalytics
                mode={mode}
                capacity={capacity}
                registered={safeRegistered}
                checkedIn={safeCheckedIn}
              />
            </div>

            {mode !== "COMPLETED" ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <Stat label="Registered" value={safeRegistered} />
                <Stat label="Remaining" value={remaining} />
                <Stat label="Capacity" value={capacity} />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center">
                <Stat label="Checked In" value={safeCheckedIn} />
                <Stat label="Registered" value={safeRegistered} />
                <Stat label="Absent" value={safeRegistered - safeCheckedIn} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default VolunteerEventCard;