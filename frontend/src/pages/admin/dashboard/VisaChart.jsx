import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function VisaChart({ data = [] }) {
  if (!data.length) return null;

  const chartData = data.map((item) => ({
    name:
      item.visa_type ??
      item.label ??
      item.name ??
      "Not specified",

    value:
      item.total ??
      item.count ??
      item.value ??
      0,
  }));

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

      <h2 className="mb-6 text-xl font-extrabold text-slate-900">
        Users by Visa Type
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

        {/* Lista izquierda */}

        <div className="space-y-3">

          {chartData.map((item) => (

            <div
              key={item.name}
              className="flex items-center justify-between border-b border-slate-100 pb-2"
            >

              <span className="text-sm font-medium text-slate-700">
                {item.name}
              </span>

              <span className="font-bold text-slate-900">
                {item.value}
              </span>

            </div>

          ))}

        </div>

        {/* Dona */}

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >

                {chartData.map((item, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* Leyenda */}

        <div className="space-y-3">

          {chartData.map((item, index) => {

            const percent =
              total === 0
                ? 0
                : ((item.value / total) * 100).toFixed(1);

            return (

              <div
                key={item.name}
                className="flex items-center gap-3"
              >

                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-sm text-slate-700">

                  {item.name}

                  <span className="font-semibold">

                    {" "}
                    ({percent}%)

                  </span>

                </span>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}

export default VisaChart;