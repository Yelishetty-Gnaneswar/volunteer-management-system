import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import OrganizerEventCard from "../../components/org/OrganizerEventCard";
import Spinner from "../../components/common/Spinner";
import { getOrganizerEvents } from "../../api/eventApi";
import { toast } from "react-toastify";
import CreateEventModal from "../../components/org/CreateEventModal";
import { useNotificationStore } from "../../utils/notificationStore";
import { Search } from "lucide-react";

const TABS = ["UPCOMING", "ONGOING", "COMPLETED", "MY EVENTS"];

const COLOR_MAP = {
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50" },
  indigo: { text: "text-indigo-600", bg: "bg-indigo-50" },
  amber: { text: "text-amber-600", bg: "bg-amber-50" },
  gray: { text: "text-gray-600", bg: "bg-gray-100" },
};

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getOrganizerEvents();
      setEvents(Array.isArray(data) ? data : []);
      addNotification("Organizer events refreshed");
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const now = new Date();

  const upcoming = events.filter((e) => new Date(e.startDate) > now);
  const ongoing = events.filter(
    (e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now
  );
  const completed = events.filter((e) => new Date(e.endDate) < now);

  const baseList =
    activeTab === "UPCOMING"
      ? upcoming
      : activeTab === "ONGOING"
      ? ongoing
      : activeTab === "COMPLETED"
      ? completed
      : events;

  const filteredEvents = baseList.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Organizer Dashboard">
      {/* ===== HERO HEADER ===== */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-3xl p-8 text-white shadow-md">
          <h1 className="text-3xl font-bold">VolunteerHub</h1>
          <p className="mt-2 text-indigo-100 text-lg">
            Organizer Dashboard
          </p>
          <p className="mt-4 max-w-2xl text-sm text-indigo-50">
            Create impactful events, manage participants, and track progress effortlessly.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50"
            >
              + Create New Event
            </button>

            <span className="px-6 py-3 rounded-xl bg-white/20">
              Total Events: <strong>{events.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Events" value={events.length} color="emerald" />
        <StatCard label="Upcoming" value={upcoming.length} color="indigo" />
        <StatCard label="Ongoing" value={ongoing.length} color="amber" />
        <StatCard label="Completed" value={completed.length} color="gray" />
      </div>

      {/* ===== TABS + SEARCH (SAME ROW) ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex gap-3 flex-wrap">
          {TABS.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              count={
                tab === "UPCOMING"
                  ? upcoming.length
                  : tab === "ONGOING"
                  ? ongoing.length
                  : tab === "COMPLETED"
                  ? completed.length
                  : events.length
              }
              active={activeTab}
              setActive={setActiveTab}
            />
          ))}
        </div>

        {/* Search (RIGHT SIDE of MY EVENTS) */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <Spinner />
        </div>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No events found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <OrganizerEventCard
              key={event.eventId}
              event={event}
              onRefresh={loadEvents}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onCreated={loadEvents}
        />
      )}
    </DashboardLayout>
  );
}

/* ===== STAT CARD ===== */
const StatCard = ({ label, value, color }) => {
  const styles = COLOR_MAP[color];
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-3xl font-bold ${styles.text}`}>{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-full ${styles.bg}`} />
    </div>
  );
};

/* ===== TAB ===== */
const Tab = ({ label, count, active, setActive }) => (
  <button
    onClick={() => setActive(label)}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
      active === label
        ? "bg-indigo-600 text-white"
        : "bg-white border text-gray-600 hover:bg-gray-100"
    }`}
  >
    {label} ({count})
  </button>
);
