import { useState } from "react";
import EventItem from "./EventItem";
import CreateEventModal from "./CreateEventModal";
import Loader from "../home/Loader";
import { PlusCircle } from "lucide-react";

const EventList = ({ events = [], onRefresh }) => {
  const [openCreate, setOpenCreate] = useState(false);

  const handleCreated = () => {
    setOpenCreate(false);
    if (typeof onRefresh === "function") {
      onRefresh();
    }
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Events</h2>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {!events || events.length === 0 ? (
        <p className="text-gray-500">No events created yet.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((e) => (
            <EventItem
              key={e.eventId}
              event={e}
              onUpdated={onRefresh}
            />
          ))}
        </div>
      )}

      {openCreate && (
        <CreateEventModal
          onClose={() => setOpenCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default EventList;
