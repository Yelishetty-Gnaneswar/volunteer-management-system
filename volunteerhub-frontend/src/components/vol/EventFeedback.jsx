import { useState } from "react";
import { toast } from "react-toastify";
import { submitEventFeedback } from "../../api/eventApi";
import { addNotification } from "../../utils/notification";

const EventFeedback = ({ eventId, onClose }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter feedback");
      return;
    }

    try {
      setLoading(true);

      await submitEventFeedback({
        eventId,
        rating,
        feedback,
      });

      toast.success("Feedback submitted successfully");

addNotification("Feedback submitted successfully");
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Event Feedback</h2>

        <label className="block mb-2 text-sm font-medium">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border rounded-lg p-2 mb-4"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <textarea
          placeholder="Write your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFeedback;
