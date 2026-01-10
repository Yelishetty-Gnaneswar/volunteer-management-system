import { useEffect, useState } from "react";
import OrganizerLayout from "../../layouts/OrganizerLayout";
import { getEventsByStatus } from "../../api/eventApi";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-toastify";

const statusStyles = {
  UPCOMING: "bg-green-100 text-green-700",
  ONGOING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

function OrganizerEvents() {
  const [events, setEvents] = useState({
    UPCOMING: [],
    ONGOING: [],
    COMPLETED: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);

        const [upcoming, ongoing, completed] = await Promise.all([
          getEventsByStatus("UPCOMING"),
          getEventsByStatus("ONGOING"),
          getEventsByStatus("COMPLETED"),
        ]);

        setEvents({
          UPCOMING: Array.isArray(upcoming) ? upcoming : [],
          ONGOING: Array.isArray(ongoing) ? ongoing : [],
          COMPLETED: Array.isArray(completed) ? completed : [],
        });
      } catch (err) {
        console.error("Failed to load events", err);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <OrganizerLayout>
      <h1 className="text-2xl font-bold mb-6">My Events</h1>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Spinner />
        </div>
      ) : (
        Object.keys(events).map((status) => (
          <div key={status} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {status} EVENTS
            </h2>

            {events[status].length === 0 ? (
              <p className="text-gray-500">No events found</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {events[status].map((event) => (
                  <div
                    key={event.eventId}
                    className="bg-white p-5 rounded shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{event.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="text-sm mt-2">
                      📍 {event.address}, {event.city}
                    </p>
                    <p className="text-sm">
                      🗓 {event.startDate} → {event.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </OrganizerLayout>
  );
}

export default OrganizerEvents;
