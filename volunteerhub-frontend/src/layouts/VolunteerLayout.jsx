import Navbar from "../components/common/Navbar";

const VolunteerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

export default VolunteerLayout;

