import { useEffect, useState } from "react";
import { getCompletedEvents, getMyRegisteredEvents } from "../../api/eventApi";
import Navbar from "../../components/common/Navbar";

const VolunteerHistory = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const registeredIds = await getMyRegisteredEvents();
      const completed = await getCompletedEvents();

      const history = completed.filter(e =>
        registeredIds.includes(e.eventId)
      );

      setEvents(history);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Volunteer History</h1>

        {events.length === 0 ? (
          <p>No completed events yet</p>
        ) : (
          events.map(e => (
            <div key={e.eventId}
              className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-semibold">{e.name}</h3>
              <p className="text-sm text-gray-500">
                {e.startDate} → {e.endDate}
              </p>
              <p className="text-sm mt-1">
                Rating: {e.rating ? `⭐ ${e.rating}` : "Not rated"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerHistory;
