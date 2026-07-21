import {
  Bell,
  CalendarDays,
  ChevronRight,
  Images,
  Settings,
  ShieldCheck,
  Users,
  BarChart3,
} from "lucide-react";

function Dashboard({
  events = [],
  gallery = [],
  userProfile,
  setAdminSection,
  language = "es",
}) {
  const translations = {
    es: {
      adminPanel: "Panel administrativo",
      welcomeBack: "Bienvenido nuevamente",
      administrator: "Administrador",
      intro:
        "Administra los usuarios, eventos, fotografías, avisos y datos de COLANT Connect desde un solo lugar.",
      administration: "Administración",
      selectSection:
        "Selecciona una sección para gestionar la aplicación.",

      users: "Usuarios",
      usersDescription: "Administrar usuarios y roles",
      manage: "Gestionar",

      events: "Eventos",
      eventsDescription: "Crear y administrar eventos",

      gallery: "Galería",
      galleryDescription: "Subir y organizar fotografías",

      notifications: "Avisos",
      notificationsDescription:
        "Enviar avisos a la comunidad",
      send: "Enviar",

      statistics: "Estadísticas",
      statisticsDescription:
        "Consultar información general",
      view: "Ver",

      settings: "Configuración",
      settingsDescription:
        "Administrar ajustes del sistema",
      open: "Abrir",

      systemSummary: "Resumen del sistema",
      photos: "Fotografías",

      centralisedAdministration:
        "Administración centralizada",
      footerDescription:
        "Utiliza este panel para gestionar el contenido disponible en la aplicación sin modificar el código.",
    },

    en: {
      adminPanel: "Administration panel",
      welcomeBack: "Welcome back",
      administrator: "Administrator",
      intro:
        "Manage COLANT Connect users, events, photos, notices and data from one place.",
      administration: "Administration",
      selectSection:
        "Select a section to manage the application.",

      users: "Users",
      usersDescription: "Manage users and roles",
      manage: "Manage",

      events: "Events",
      eventsDescription: "Create and manage events",

      gallery: "Gallery",
      galleryDescription: "Upload and organise photos",

      notifications: "Notices",
      notificationsDescription:
        "Send notices to the community",
      send: "Send",

      statistics: "Statistics",
      statisticsDescription:
        "View general application information",
      view: "View",

      settings: "Settings",
      settingsDescription:
        "Manage system settings",
      open: "Open",

      systemSummary: "System summary",
      photos: "Photos",

      centralisedAdministration:
        "Centralised administration",
      footerDescription:
        "Use this panel to manage the content available in the application without modifying the code.",
    },
  };

  const t = translations[language] || translations.es;

  const cards = [
    {
      key: "users",
      title: t.users,
      description: t.usersDescription,
      value: t.manage,
      icon: Users,
    },
    {
      key: "events",
      title: t.events,
      description: t.eventsDescription,
      value: events.length,
      icon: CalendarDays,
    },
    {
      key: "gallery",
      title: t.gallery,
      description: t.galleryDescription,
      value: gallery.length,
      icon: Images,
    },
    {
      key: "notifications",
      title: t.notifications,
      description: t.notificationsDescription,
      value: t.send,
      icon: Bell,
    },
    {
      key: "statistics",
      title: t.statistics,
      description: t.statisticsDescription,
      value: t.view,
      icon: BarChart3,
    },
    {
      key: "settings",
      title: t.settings,
      description: t.settingsDescription,
      value: t.open,
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] bg-slate-950 px-6 py-7 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
              <ShieldCheck size={15} />
              {t.adminPanel}
            </div>

            <p className="text-sm font-medium text-slate-400">
              {t.welcomeBack}
            </p>

            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
              {userProfile?.full_name || t.administrator}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              {t.intro}
            </p>
          </div>

          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 md:flex">
            <ShieldCheck size={28} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-slate-950">
            {t.administration}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t.selectSection}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setAdminSection(card.key)}
                className="group flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
                  <Icon size={25} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-950">
                        {card.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {card.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {card.value}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-800"
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-950">
          {t.systemSummary}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.events}
            </p>

            <p className="mt-2 text-2xl font-extrabold text-slate-950">
              {events.length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.photos}
            </p>

            <p className="mt-2 text-2xl font-extrabold text-slate-950">
              {gallery.length}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 p-5 text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          COLANT Connect
        </p>

        <h2 className="mt-2 text-xl font-extrabold">
          {t.centralisedAdministration}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {t.footerDescription}
        </p>
      </section>
    </div>
  );
}

export default Dashboard;