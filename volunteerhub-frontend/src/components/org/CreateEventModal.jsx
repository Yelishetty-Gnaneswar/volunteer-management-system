import { useState } from "react";
import { toast } from "react-toastify";
import { createEvent } from "../../api/eventApi";
import { useNotificationStore } from "../../utils/notificationStore";

const CreateEventModal = ({ onClose, onCreated }) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    startDate: "",
    endDate: "",
    maximumAllowedRegistrations: "",
    registrationAllowed: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.address ||
      !form.city ||
      !form.startDate ||
      !form.endDate ||
      !form.maximumAllowedRegistrations
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await createEvent({
        ...form,
        maximumAllowedRegistrations: Number(
          form.maximumAllowedRegistrations
        ),
      });

      toast.success("Event created successfully");

      // 🔔 ORGANIZER NOTIFICATION
      addNotification(`Event "${form.name}" created`);

      onCreated?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data || "Event creation failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Create New Event
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Event Name"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              className="border p-3 rounded"
              onChange={handleChange}
            />
            <input
              type="date"
              name="endDate"
              className="border p-3 rounded"
              onChange={handleChange}
            />
          </div>

          <input
            type="number"
            name="maximumAllowedRegistrations"
            placeholder="Maximum Volunteers"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
