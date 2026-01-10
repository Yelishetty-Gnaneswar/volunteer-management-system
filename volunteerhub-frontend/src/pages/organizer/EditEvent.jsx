import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getEventById, updateEvent } from "../../api/eventApi";
import { useNotificationStore } from "../../utils/notificationStore";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    eventId: "",
    name: "",
    description: "",
    address: "",
    city: "",
    startDate: "",
    endDate: "",
    maximumAllowedRegistrations: "",
  });

  /* ================= LOAD EVENT ================= */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEventById(eventId);

        setForm({
          eventId: data.eventId,
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          city: data.city || "",
          startDate: data.startDate, // YYYY-MM-DD
          endDate: data.endDate,
          maximumAllowedRegistrations: data.volunteersNeeded,
        });
      } catch (err) {
        console.error("LOAD EVENT ERROR:", err);
        toast.error("Failed to load event details");
        navigate("/organizer/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, navigate]);

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateEvent({
        eventId: form.eventId, // 🔴 REQUIRED
        name: form.name,
        description: form.description,
        address: form.address,
        city: form.city,
        startDate: form.startDate,
        endDate: form.endDate,
        maximumAllowedRegistrations: Number(
          form.maximumAllowedRegistrations
        ),
      });

      toast.success("Event updated successfully");

      // 🔔 Organizer notification
      addNotification(`Event "${form.name}" updated`);

      navigate("/organizer/dashboard");
    } catch (err) {
      console.error("UPDATE ERROR:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.error ||
          "Update failed. Please check dates and try again."
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Event">
        <p className="text-center mt-20 text-gray-500">
          Loading event details...
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Event">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl max-w-xl space-y-4 shadow-md"
      >
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full border p-3 rounded"
          placeholder="Event Name"
          required
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-3 rounded"
          placeholder="Description"
        />

        <input
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
          className="w-full border p-3 rounded"
          placeholder="Address"
          required
        />

        <input
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
          className="w-full border p-3 rounded"
          placeholder="City"
          required
        />

        <input
          type="date"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          min="1"
          value={form.maximumAllowedRegistrations}
          onChange={(e) =>
            setForm({
              ...form,
              maximumAllowedRegistrations: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
          placeholder="Maximum Volunteers"
          required
        />

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Update Event
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default EditEvent;
