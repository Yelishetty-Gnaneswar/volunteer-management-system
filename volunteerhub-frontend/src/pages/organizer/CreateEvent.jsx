import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OrganizerLayout from "../../layouts/OrganizerLayout";
import { createEvent } from "../../api/eventApi";
import { addNotification } from "../../utils/notificationStore";

function CreateEvent() {
  const navigate = useNavigate();

  // ✅ LOCAL DATE (NO UTC BUG, GREYS OUT PAST DATES)
  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getToday();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.startDate < today) {
      toast.error("Past dates are not allowed");
      return;
    }

    if (form.endDate < form.startDate) {
      toast.error("End date must be after start date");
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

      const email = localStorage.getItem("email");
      if (email) {
        addNotification(
          email,
          `Event "${form.name}" created successfully`
        );
      }

      navigate("/organizer/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Failed to create event");
    }
  };

  return (
    <OrganizerLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Create New Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6"
        >
          {/* TEXT FIELDS */}
          {["name", "description", "address", "city"].map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </label>
              <input
                required
                placeholder={`Enter ${k}`}
                className="w-full rounded-xl border border-gray-300 px-4 py-3
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form[k]}
                onChange={(e) =>
                  setForm({ ...form, [k]: e.target.value })
                }
              />
            </div>
          ))}

          {/* START DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              required
              min={today}
              value={form.startDate}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                  endDate: "",
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         disabled:bg-gray-100 disabled:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Past dates are disabled
            </p>
          </div>

          {/* END DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              required
              min={form.startDate || today}
              disabled={!form.startDate}
              value={form.endDate}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          {/* MAX VOLUNTEERS */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Maximum Volunteers
            </label>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 50"
              value={form.maximumAllowedRegistrations}
              onChange={(e) =>
                setForm({
                  ...form,
                  maximumAllowedRegistrations: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* REGISTRATION TOGGLE */}
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.registrationAllowed}
              onChange={(e) =>
                setForm({
                  ...form,
                  registrationAllowed: e.target.checked,
                })
              }
              className="h-4 w-4 accent-indigo-600"
            />
            Allow volunteer registration
          </label>

          {/* ACTION BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl
                         font-semibold hover:bg-indigo-700 transition"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </OrganizerLayout>
  );
}

export default CreateEvent;
