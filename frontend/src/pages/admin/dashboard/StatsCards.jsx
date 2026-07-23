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
    <div
      className="mb-8 grid gap-4"
      style={{
        gridTemplateColumns:
          "repeat(auto-fit, minmax(210px, 1fr))",
      }}
    >
      {stats.map((item) => {
        const Icon = getIcon(item.title);

        return (
          <article
            key={item.id || item.title}
            className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-950 text-white">
                <Icon size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-3xl font-extrabold leading-none text-slate-950">
                  {item.value}
                </h2>

                <p className="mt-2 break-words text-base font-bold leading-5 text-slate-800">
                  {item.title}
                </p>
              </div>
            </div>

            <p className="mt-4 break-words text-sm leading-5 text-slate-500">
              {item.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default StatsCards;