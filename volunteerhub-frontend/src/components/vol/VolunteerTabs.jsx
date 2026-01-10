const tabs = [
  { key: "UPCOMING", label: "Upcoming" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "COMPLETED", label: "Completed" },
  { key: "MY", label: "My Events" },
];

const VolunteerTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-3 bg-gray-100 p-2 rounded-xl w-fit">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setActiveTab(t.key)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === t.key
              ? "bg-white shadow text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default VolunteerTabs;