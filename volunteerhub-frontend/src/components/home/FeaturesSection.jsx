import { useNavigate } from "react-router-dom";
import { Calendar, Users, Bell } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Event Management",
    desc: "Create, update, and manage events effortlessly.",
  },
  {
    icon: Users,
    title: "Volunteer Engagement",
    desc: "Register, track attendance, and collect feedback.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Automated emails for updates, reminders, and cancellations.",
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-center mb-14">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => navigate("/auth")}
              className="cursor-pointer bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              <f.icon className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
