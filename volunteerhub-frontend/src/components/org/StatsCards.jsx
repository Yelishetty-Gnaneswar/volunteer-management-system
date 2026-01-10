const StatsCards = ({ totalEvents, upcoming, ongoing, completed }) => {
  const stats = [
    { label: "Total Events", value: totalEvents, color: "from-indigo-500 to-indigo-600" },
    { label: "Upcoming", value: upcoming, color: "from-blue-500 to-blue-600" },
    { label: "Ongoing", value: ongoing, color: "from-green-500 to-green-600" },
    { label: "Completed", value: completed, color: "from-gray-500 to-gray-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl p-6 shadow-lg text-white bg-gradient-to-br ${s.color}
                      hover:scale-[1.03] transition`}
        >
          <p className="text-sm opacity-90">{s.label}</p>
          <h2 className="text-3xl font-bold mt-2">{s.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;