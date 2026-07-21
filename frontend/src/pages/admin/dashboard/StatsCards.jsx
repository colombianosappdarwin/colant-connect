import {
  Users,
  CalendarDays,
  Image,
  Bell,
} from "lucide-react";

const icons = {
  "Registered Users": Users,
  Events: CalendarDays,
  "Gallery Photos": Image,
  Notifications: Bell,
};

function StatsCards({ stats }) {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = icons[item.title];

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-950 text-white">
              <Icon size={28} />
            </div>

            <h2 className="text-4xl font-extrabold text-slate-900">
              {item.value}
            </h2>

            <p className="mt-2 font-bold text-slate-700">
              {item.title}
            </p>

            <p className="mt-3 text-sm text-slate-500">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;