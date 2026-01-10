import { useNavigate } from "react-router-dom";

const UpcomingEvents = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-indigo-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold mb-6">
          Upcoming Community Events
        </h2>

        <p className="text-gray-600 mb-10">
          Discover volunteering opportunities around you.
        </p>

        <div className="bg-white rounded-2xl p-10 shadow">
          <p className="text-gray-500 mb-6">
            Login to view and register for upcoming events.
          </p>

          <button
            onClick={() => navigate("/auth")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Login to Continue
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
