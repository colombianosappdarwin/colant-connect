import { CalendarDays } from "lucide-react";

function DashboardHeader({ language = "es" }) {
  const translations = {
    es: {
      title: "Panel administrativo",
      description:
        "Estadísticas en tiempo real de la comunidad colombiana en Australia.",
      locale: "es-AU",
    },

    en: {
      title: "Admin Dashboard",
      description:
        "Real-time statistics for the Colombian community in Australia.",
      locale: "en-AU",
    },
  };

  const t = translations[language] || translations.es;

  const today = new Date().toLocaleDateString(
    t.locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 shadow-2xl sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            COLANT CONNECT
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            {t.title}
          </h1>

          <p className="mt-3 max-w-2xl leading-6 text-slate-300">
            {t.description}
          </p>
        </div>

        <div className="w-fit rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-white shadow-lg">
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