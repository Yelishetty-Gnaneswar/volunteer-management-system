import OrganizerLayout from "../../layouts/OrganizerLayout";
import { feedbacks } from "../../utils/feedbackStore";
import { events } from "../../utils/eventStore";

function Feedback() {
  // Group feedback by event
  const groupedFeedback = {};

  feedbacks.forEach((fb) => {
    if (!groupedFeedback[fb.eventId]) {
      groupedFeedback[fb.eventId] = [];
    }
    groupedFeedback[fb.eventId].push(fb);
  });

  const getEventName = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.title : "Unknown Event";
  };

  return (
    <OrganizerLayout>
      <h1 className="text-2xl font-bold mb-6">Volunteer Feedback</h1>

      {Object.keys(groupedFeedback).length === 0 ? (
        <p className="text-gray-500">No feedback received yet.</p>
      ) : (
        Object.keys(groupedFeedback).map((eventId) => (
          <div key={eventId} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              {getEventName(Number(eventId))}
            </h2>

            <div className="space-y-4">
              {groupedFeedback[eventId].map((fb, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4"
                >
                  <p className="font-medium">
                    ⭐ Rating: {fb.rating}/5
                  </p>

                  {fb.comment && (
                    <p className="text-gray-700 mt-1">
                      💬 {fb.comment}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Submitted on{" "}
                    {new Date(fb.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </OrganizerLayout>
  );
}

export default Feedback;
