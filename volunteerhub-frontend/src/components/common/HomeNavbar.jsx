import { useNavigate } from "react-router-dom";

const HomeNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* BRAND */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-extrabold"
        >
          <span className="text-indigo-600">Volunteer</span>
          <span className="text-gray-800">Hub</span>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/auth?mode=login")}
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/auth?mode=register")}
            className="px-4 py-2 rounded-xl text-sm font-bold
                       bg-indigo-600 text-white
                       hover:bg-indigo-700 transition shadow"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
