import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Manage Volunteering with <span className="text-yellow-300">Ease</span>
        </h1>

        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90">
          VolunteerHub connects organisers and volunteers to create impactful
          community events — all in one place.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/auth?mode=login")}
            className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
