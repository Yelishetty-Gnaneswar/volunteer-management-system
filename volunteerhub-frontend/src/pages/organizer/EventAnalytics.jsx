import EventParticipationPie from "../../components/charts/EventParticipationPie";

const EventAnalytics = ({ selectedEvent }) => {
  if (!selectedEvent) {
    return (
      <p className="text-gray-500 text-center">
        Select an event to view participation
      </p>
    );
  }

  return (
    <EventParticipationPie
      totalSlots={selectedEvent.capacity}
      registered={selectedEvent.registeredCount}
    />
  );
};

export default EventAnalytics;
