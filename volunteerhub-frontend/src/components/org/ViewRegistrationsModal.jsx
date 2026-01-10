import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getParticipants, checkInVolunteer } from "../../api/eventApi";

const ViewRegistrationsModal = ({ eventId, onClose }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [checkedIn, setCheckedIn] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRegistrations = async () => {
    try {
      setLoading(true);

      const res = await getParticipants(eventId);

      console.log("Participants API response:", res); // 🔍 DEBUG

      setVolunteers(res.volunteers ?? []);
      setCheckedIn(res.checkedIn ?? []);
    } catch (err) {
      toast.error("Failed to load participants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const handleCheckIn = async (emailId) => {
    try {
      await checkInVolunteer({ eventId, emailId });
      toast.success("Volunteer checked-in");
      loadRegistrations();
    } catch (err) {
      toast.error(err.response?.data || "Check-in failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Registered Volunteers
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : volunteers.length === 0 ? (
          <p className="text-center text-gray-500">
            No participants registered yet
          </p>
        ) : (
          <div className="space-y-3 max-h-[320px] overflow-y-auto">
            {volunteers.map((email) => {
              const isCheckedIn = checkedIn.includes(email);

              return (
                <div
                  key={email}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <span>{email}</span>

                  {isCheckedIn ? (
                    <span className="text-green-600 font-semibold">
                      ✔ Checked-in
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(email)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Check-in
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRegistrationsModal;
