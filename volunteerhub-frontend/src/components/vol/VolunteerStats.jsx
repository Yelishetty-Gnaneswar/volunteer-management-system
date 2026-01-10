import { useEffect, useState } from "react";
import {
  getUpcomingEvents,
  getOngoingEvents,
  getCompletedEvents,
} from "../../api/eventApi";

import {
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const VolunteerStats = () => {
  const [stats, setStats] = useState({
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const results = await Promise.allSettled([
          getUpcomingEvents(),
          getOngoingEvents(),
          getCompletedEvents(),
        ]);

        const u =
          results[0].status === "fulfilled" ? results[0].value : [];
        const o =
          results[1].status === "fulfilled" ? results[1].value : [];
        const c =
          results[2].status === "fulfilled" ? results[2].value : [];

        setStats({
          upcoming: Array.isArray(u) ? u.length : 0,
          ongoing: Array.isArray(o) ? o.length : 0,
          completed: Array.isArray(c) ? c.length : 0,
        });
      } catch (err) {
        console.error("Failed to load volunteer stats", err);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      label: "Total Events",
      value: stats.upcoming + stats.ongoing + stats.completed,
      icon: Calendar,
      valueColor: "text-teal-600",
      iconBg: "bg-teal-50",
    },
    {
      label: "Upcoming Events",
      value: stats.upcoming,
      icon: TrendingUp,
      valueColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Ongoing",
      value: stats.ongoing,
      icon: AlertCircle,
      valueColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      valueColor: "text-slate-600",
      iconBg: "bg-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white rounded-2xl p-6 shadow-sm
                       hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <h2 className={`text-3xl font-bold mt-2 ${c.valueColor}`}>
                {c.value}
              </h2>
            </div>

            <div className={`p-3 rounded-xl ${c.iconBg}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VolunteerStats;
