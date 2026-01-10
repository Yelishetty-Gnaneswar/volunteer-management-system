import { PieChart, Pie, Cell } from "recharts";

const COLORS = {
  primary: "#22c55e",
  secondary: "#e5e7eb",
};

const EventDonutAnalytics = ({
  mode,
  capacity = 0,
  registered = 0,
  checkedIn = 0,
  onSelect,
}) => {
  let primaryLabel = "";
  let primaryValue = 0;
  let secondaryValue = 0;
  let percent = 0;

  if (mode === "COMPLETED") {
    primaryLabel = "Checked In";
    primaryValue = checkedIn;
    secondaryValue = Math.max(registered - checkedIn, 0);
    percent = registered
      ? Math.round((checkedIn / registered) * 100)
      : 0;
  } else {
    primaryLabel = "Registered";
    primaryValue = registered;
    secondaryValue = Math.max(capacity - registered, 0);
    percent = capacity
      ? Math.round((registered / capacity) * 100)
      : 0;
  }

  const data =
    primaryValue === 0 && secondaryValue === 0
      ? [{ value: 1, type: "EMPTY" }]
      : [
          { value: primaryValue, type: "PRIMARY" },
          { value: secondaryValue, type: "SECONDARY" },
        ];

  const handleClick = (entry) => {
    if (!onSelect) return;

    if (mode === "COMPLETED") {
      onSelect(entry.type === "PRIMARY" ? "CHECKED_IN" : "ABSENT");
    } else {
      onSelect(entry.type === "PRIMARY" ? "REGISTERED" : "REMAINING");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={75}
            outerRadius={95}
            paddingAngle={2}
            onClick={handleClick}
          >
            <Cell fill={COLORS.primary} />
            <Cell fill={COLORS.secondary} />
          </Pie>
        </PieChart>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-3xl font-bold">{percent}%</p>
          <p className="text-sm text-gray-500">
            {mode === "COMPLETED" ? "Attendance" : "Filled"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDonutAnalytics;
