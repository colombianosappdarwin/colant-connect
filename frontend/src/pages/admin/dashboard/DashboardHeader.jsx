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

  const today = new Date().toLocaleDateString(t.locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 shadow-2xl sm:p-7">
      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400 sm:text-sm">
            COLANT CONNECT
          </p>

          <h1 className="mt-2 break-words text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            {t.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white shadow-lg">
          <CalendarDays
            size={20}
            className="shrink-0 text-blue-400"
          />

          <span className="whitespace-nowrap text-sm font-semibold sm:text-base">
            {today}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;