import { useState } from "react";
import { toast } from "react-toastify";
import { updateEvent } from "../../api/eventApi";

const EditEventModal = ({ event, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    eventId: event.eventId,
    name: event.name,
    address: event.address,
    city: event.city,
    startDate: event.startDate?.substring(0, 10),
    endDate: event.endDate?.substring(0, 10),
    maximumAllowedRegistrations: event.volunteersNeeded,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateEvent({
        ...form,
        maximumAllowedRegistrations: Number(
          form.maximumAllowedRegistrations
        ),
      });

      toast.success("Event updated successfully");
      onUpdated?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[480px] p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Edit Event
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Event Name"
          className="w-full border p-3 rounded-lg mb-3"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-3 rounded-lg mb-3"
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border p-3 rounded-lg mb-3"
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            min={form.startDate}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <input
          type="number"
          min="1"
          name="maximumAllowedRegistrations"
          value={form.maximumAllowedRegistrations}
          onChange={handleChange}
          placeholder="Maximum Volunteers"
          className="w-full border p-3 rounded-lg mb-6"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
