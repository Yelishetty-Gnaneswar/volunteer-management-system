import {
  Calendar,
  MapPin,
  Users,
  Trash2,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "../../api/eventApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNotificationStore } from "../../utils/notificationStore";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#6366f1", "#e5e7eb"];

const OrganizerEventCard = ({ event, onRefresh }) => {
  const navigate = useNavigate();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [showDonut, setShowDonut] = useState(false);

  /* ---------- DATE STATUS ---------- */
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const isUpcoming = start > now;
  const isOngoing = start <= now && end >= now;
  const isCompleted = end < now;

  /* ---------- SAFE NUMBERS ---------- */
  const capacity = Number(event.volunteersNeeded) || 0;
  const registered = Number(event.registeredCount) || 0;
  const checkedIn = Number(event.checkedInCount) || 0;
  const avgRating =
    event.averageRating !== null &&
    event.averageRating !== undefined
      ? Number(event.averageRating).toFixed(1)
      : null;

  /* ---------- DONUT DATA (FIXED) ---------- */
  const donutData = useMemo(() => {
    let data = [];

    if (isUpcoming) {
      data = [
        { name: "Registered", value: registered },
        {
          name: "Remaining",
          value: Math.max(capacity - registered, 0),
        },
      ];
    } else if (isOngoing) {
      data = [
        { name: "Checked In", value: checkedIn },
        {
          name: "Not Checked In",
          value: Math.max(registered - checkedIn, 0),
        },
      ];
    } else {
      const rating = Number(event.averageRating) || 0;
      data = [
        { name: "Rating", value: rating },
        { name: "Remaining", value: Math.max(5 - rating, 0) },
      ];
    }

    // 🚑 Prevent empty donut crash
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return [{ name: "Empty", value: 1 }];

    return data;
  }, [
    isUpcoming,
    isOngoing,
    isCompleted,
    capacity,
    registered,
    checkedIn,
    event.averageRating,
  ]);

  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete this event permanently?")) return;

    try {
      await deleteEvent(event.eventId);
      toast.success("Event deleted successfully");
      addNotification(`Event "${event.name}" deleted`);
      onRefresh();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      onClick={() => setShowDonut((s) => !s)}
      className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer"
    >
      {/* STATUS STRIP */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
          isCompleted
            ? "bg-gray-400"
            : isOngoing
            ? "bg-amber-400"
            : "bg-emerald-400"
        }`}
      />

      <div className="p-5 space-y-4">
        {/* HEADER */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {event.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description || "No description provided"}
          </p>
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

        {/* DONUT */}
        {showDonut && (
          <div className="flex flex-col items-center py-4">
            <PieChart width={150} height={150}>
              <Pie
                data={donutData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {donutData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            <p className="text-sm font-semibold text-gray-700 mt-2">
              {isUpcoming && "Registrations"}
              {isOngoing && "Check-ins"}
              {isCompleted && "Average Rating"}
            </p>

            <p className="text-xs text-gray-500">
              {isUpcoming && `${registered} / ${capacity}`}
              {isOngoing && `${checkedIn} / ${registered}`}
              {isCompleted &&
                (avgRating ? `${avgRating} / 5` : "No rating")}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div
          className="grid gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() =>
              navigate(
                `/organizer/events/${event.eventId}/participants`
              )
            }
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-indigo-300 text-indigo-600 font-semibold hover:bg-indigo-50"
          >
            <Users className="h-4 w-4" />
            View Participants
          </button>

          {isUpcoming && (
            <>
              <button
                onClick={() =>
                  navigate(
                    `/organizer/events/${event.eventId}/edit`
                  )
                }
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-amber-300 text-amber-600 font-semibold hover:bg-amber-50"
              >
                <Pencil className="h-4 w-4" />
                Edit Event
              </button>

              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-rose-300 text-rose-600 font-semibold hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Event
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizerEventCard;
