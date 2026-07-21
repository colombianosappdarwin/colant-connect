import { CalendarDays } from "lucide-react";

function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 shadow-2xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
            COLANT CONNECT
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-white">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-slate-300">
            Real-time statistics for the Colombian community in Australia.
          </p>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-white shadow-lg">

          <div className="flex items-center gap-3">

            <CalendarDays size={22} />

            <span className="font-semibold">
              {today}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardHeader;