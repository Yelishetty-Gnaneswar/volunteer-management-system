import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import VolunteerLayout from "../../layouts/VolunteerLayout";
import { getEventsByStatus } from "../../api/eventApi";
import FeedbackModal from "../../components/FeedbackModal";

function Events() {
  const [events, setEvents] = useState({
    UPCOMING: [],
    ONGOING: [],
    COMPLETED: [],
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setEvents({
      UPCOMING: (await getEventsByStatus("UPCOMING")).data,
      ONGOING: (await getEventsByStatus("ONGOING")).data,
      COMPLETED: (await getEventsByStatus("COMPLETED")).data,
    });
  };

  return (
    <VolunteerLayout>
      <h1 className="text-2xl font-bold mb-6">Events</h1>

      {Object.keys(events).map((status) => (
        <div key={status} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{status} Events</h2>

          {events[status].length === 0 ? (
            <p className="text-gray-500">No events found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events[status].map((event) => (
                <div key={event.id} className="bg-white shadow rounded-xl p-5">
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm">📍 {event.address}, {event.city}</p>
                  <p className="text-sm">🕒 {event.startDate}</p>

                  {status === "COMPLETED" && (
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="mt-3 bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {selectedEvent && (
        <FeedbackModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </VolunteerLayout>
  );
}

export default Events;
