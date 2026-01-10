import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import VolunteerStats from "../../components/vol/VolunteerStats";
import VolunteerTabs from "../../components/vol/VolunteerTabs";
import VolunteerEventCard from "../../components/vol/VolunteerEventCard";
import EmptyState from "../../components/vol/EmptyState";
import Spinner from "../../components/common/Spinner";

import {
  getUpcomingEvents,
  getOngoingEvents,
  getCompletedEvents,
  getMyRegisteredEvents,
} from "../../api/eventApi";

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // ✅ REQUIRED
  const [search, setSearch] = useState("");
  const [myMap, setMyMap] = useState({});
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD MY REGISTRATIONS ---------------- */
  const loadMyEvents = async () => {
    try {
      const registrations = await getMyRegisteredEvents();
      const map = {};

      registrations.forEach((r) => {
        map[r.eventId] = {
          registered: true,
          rating: r.rating,
        };
      });

      setMyMap(map);
    } catch {
      setMyMap({});
    }
  };

  /* ---------------- LOAD ALL EVENTS (ONCE) ---------------- */
  const loadAllEvents = async () => {
    try {
      const all = [
        ...(await getUpcomingEvents()),
        ...(await getOngoingEvents()),
        ...(await getCompletedEvents()),
      ];
      setAllEvents(all);
    } catch {
      setAllEvents([]);
    }
  };

  /* ---------------- LOAD EVENTS (TAB WISE) ---------------- */
  const loadEvents = async () => {
    try {
      setLoading(true);
      let data = [];

      switch (activeTab) {
        case "UPCOMING":
          data = await getUpcomingEvents();
          break;

        case "ONGOING":
          data = await getOngoingEvents();
          break;

        case "COMPLETED":
          data = await getCompletedEvents();
          break;

        case "MY":
          data = allEvents.filter((e) => myMap[e.eventId]);
          break;

        default:
          data = [];
      }

      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    const init = async () => {
      await loadMyEvents();
      await loadAllEvents();
    };
    init();
  }, []);

  /* ---------------- TAB CHANGE ---------------- */
  useEffect(() => {
    loadEvents();
  }, [activeTab, allEvents, myMap]);

  const refresh = async (nextTab) => {
    if (nextTab) setActiveTab(nextTab);
    await loadMyEvents();
    await loadAllEvents();
  };

  /* ---------------- SEARCH ---------------- */
  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();

    return events.filter(
      (e) =>
        e.eventName?.toLowerCase().includes(q) ||
        e.city?.toLowerCase().includes(q)
    );
  }, [search, events]);

  /* ---------------- ✅ FINAL STATS (DATE FIXED) ---------------- */
  const stats = useMemo(() => {
    let upcoming = 0;
    let ongoing = 0;
    let completed = 0;

    const now = new Date();

    Object.keys(myMap).forEach((id) => {
      const e = allEvents.find(
        (ev) => ev.eventId === Number(id)
      );
      if (!e) return;

      // ✅ DATE NORMALIZATION (CRITICAL FIX)
      const start = new Date(e.startDate + "T00:00:00");
      const end = new Date(e.endDate + "T23:59:59");

      if (now < start) upcoming++;
      else if (now > end) completed++;
      else ongoing++;
    });

    return {
      registered: Object.keys(myMap).length,
      upcoming,
      ongoing,
      completed,
    };
  }, [myMap, allEvents]);

  return (
    <DashboardLayout title="Volunteer Dashboard">
      <div className="space-y-10">

        {/* ---------- STATS ---------- */}
        <VolunteerStats stats={stats} />

        {/* ---------- TABS ---------- */}
        <section className="sticky top-20 z-10 bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-sm">
          <VolunteerTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </section>

        {/* ---------- EVENTS ---------- */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === "MY" ? "My Events" : "Events"}
            </h2>

            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Spinner />
            </div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((e) => {
                const meta = myMap[e.eventId] || {};

                return (
                  <VolunteerEventCard
                    key={e.eventId}
                    event={e}
                    isRegistered={meta.registered}
                    existingRating={meta.rating}
                    refresh={refresh}
                    activeTab={activeTab}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default VolunteerDashboard;
