import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getParticipants, checkInVolunteer } from "../../api/eventApi";

const Participants = () => {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadParticipants = async () => {
    try {
      setLoading(true);

      const data = await getParticipants(eventId);

      console.log("Participants API response:", data);

      const volunteers = data?.volunteers || [];
      const checkedIn = data?.checkedIn || [];

      // 🔑 Build UI-friendly participant objects
      const formatted = volunteers.map((email) => ({
        email,
        checkIn: checkedIn.includes(email),
      }));

      setParticipants(formatted);
    } catch (err) {
      toast.error("Failed to load participants");
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [eventId]);

  const handleCheckIn = async (email) => {
    try {
      await checkInVolunteer({ eventId, emailId: email });
      toast.success("Checked in successfully");
      loadParticipants();
    } catch {
      toast.error("Check-in failed");
    }
  };

  return (
    <DashboardLayout title="Participants">
      {loading ? (
        <p className="mt-20 text-center">Loading...</p>
      ) : participants.length === 0 ? (
        <p className="mt-20 text-center text-gray-500">
          No participants registered
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">
                    {p.checkIn ? "Checked In" : "Registered"}
                  </td>
                  <td className="p-3">
                    {!p.checkIn && (
                      <button
                        onClick={() => handleCheckIn(p.email)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                      >
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Participants;
