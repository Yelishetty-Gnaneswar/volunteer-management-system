import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditEventModal from "./EditEventModal";
import ViewRegistrationsModal from "./ViewRegistrationsModal";
import { deleteEvent, getParticipants } from "../../api/eventApi";
import { getEventStatus } from "../../utils/eventStatus";
import { useNavigate } from "react-router-dom";
import { Users, Eye, Edit, Trash2, FileText, Calendar, MapPin } from "lucide-react";

const EventItem = ({ event, onUpdated }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

  const navigate = useNavigate();
  const status = getEventStatus(event);
  const isEditable = status === "UPCOMING";

  const loadCounts = async () => {
    try {
      const res = await getParticipants(event.eventId);
      setParticipantsCount(res?.totalParticipants || 0); // ✅ FIX
    } catch {
      console.error("Failed to load participants");
    }
  };

  useEffect(() => {
    loadCounts();
  }, [event.eventId]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this event?")) return;

    try {
      setDeleting(true);
      await deleteEvent(event.eventId);
      toast.success("Event deleted");
      onUpdated?.();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow border">
        <div className="flex justify-between gap-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
              <FileText className="w-5 h-5" /> {event.name}
            </h3>

            <p className="text-sm text-gray-500 mb-2">{event.description}</p>

            <p className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="w-4 h-4" /> {event.address}, {event.city}
            </p>

            <p className="flex items-center gap-2 text-sm mb-3">
              <Calendar className="w-4 h-4" />
              {event.startDate} → {event.endDate}
            </p>

            <span className="flex items-center gap-2 text-sm text-green-600">
              <Users className="w-4 h-4" />
              Participants: {participantsCount}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <button
              onClick={() => navigate(`/organizer/events/${event.eventId}/participants`)}
              className="text-green-600"
            >
              <Users className="w-5 h-5" /> Participants
            </button>

            <button onClick={() => setViewOpen(true)} className="text-indigo-600">
              <Eye className="w-5 h-5" /> View
            </button>

            <button
              onClick={() => setEditOpen(true)}
              disabled={!isEditable}
              className={isEditable ? "text-blue-600" : "text-gray-400"}
            >
              <Edit className="w-5 h-5" /> Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={!isEditable || deleting}
              className={isEditable ? "text-red-600" : "text-gray-400"}
            >
              <Trash2 className="w-5 h-5" /> Delete
            </button>
          </div>
        </div>
      </div>

      {editOpen && <EditEventModal event={event} onClose={() => setEditOpen(false)} onUpdated={onUpdated} />}
      {viewOpen && <ViewRegistrationsModal eventId={event.eventId} onClose={() => setViewOpen(false)} />}
    </>
  );
};

export default EventItem;
