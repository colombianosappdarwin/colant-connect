import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function GrowthChart({ data = [] }) {
  if (!data.length) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-extrabold text-slate-900">
        User Growth
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="month" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GrowthChart;