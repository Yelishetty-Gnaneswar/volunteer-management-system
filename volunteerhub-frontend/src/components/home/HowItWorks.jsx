import { useNavigate } from "react-router-dom";

const steps = [
  "Create an account",
  "Explore or create events",
  "Register or manage volunteers",
  "Get reminders & updates automatically",
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold mb-12">How It Works</h2>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => (
            <div key={i} className="p-6 rounded-xl bg-gray-50 shadow">
              <div className="text-indigo-600 font-extrabold text-2xl mb-2">
                {i + 1}
              </div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/auth?mode=register")}
          className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Join VolunteerHub
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
