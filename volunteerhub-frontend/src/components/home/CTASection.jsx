import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-emerald-500 py-20 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-6">
          Ready to Make an Impact?
        </h2>

        <p className="text-lg mb-10 opacity-90">
          Whether you’re organising or volunteering — VolunteerHub has you
          covered.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="bg-white text-indigo-600 px-10 py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            Register Now
          </button>

          <button
            onClick={() => navigate("/auth?mode=login")}
            className="border border-white px-10 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
