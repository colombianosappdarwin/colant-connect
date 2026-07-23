import {
  Users,
  CalendarDays,
  Image,
  Bell,
} from "lucide-react";

function StatsCards({ stats = [] }) {
  const getIcon = (title) => {
    switch (title) {
      case "Registered Users":
      case "Usuarios registrados":
        return Users;

      case "Events":
      case "Eventos":
        return CalendarDays;

      case "Gallery Photos":
      case "Fotos de la galería":
        return Image;

      case "Notifications":
      case "Notificaciones":
        return Bell;

      default:
        return Users;
    }
  };

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = getIcon(item.title);

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950 text-white">
              <Icon size={24} />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900">
              {item.value}
            </h2>

            <p className="mt-2 text-base font-bold leading-tight text-slate-800">
              {item.title}
            </p>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;