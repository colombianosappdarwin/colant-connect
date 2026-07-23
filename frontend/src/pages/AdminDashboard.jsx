import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import EventsAdmin from "./admin/EventsAdmin";
import GalleryAdmin from "./admin/GalleryAdmin";
import NotificationsAdmin from "./admin/NotificationsAdmin";
import StatisticsAdmin from "./admin/Statistics";
import SettingsAdmin from "./admin/SettingsAdmin";

function AdminDashboard({
  events = [],
  gallery = [],
  userProfile,
  onEventsUpdated,
  language = "es",
}) {
  const [adminSection, setAdminSection] =
    useState("dashboard");

  const translations = {
    es: {
      adminPanel: "Panel administrativo",
      backToDashboard: "Volver al panel principal",
      users: "Administración de usuarios",
      events: "Administración de eventos",
      gallery: "Administración de galería",
      notifications: "Administración de avisos",
      statistics: "Estadísticas",
      settings: "Configuración",
    },

    en: {
      adminPanel: "Administration panel",
      backToDashboard: "Back to main dashboard",
      users: "User management",
      events: "Event management",
      gallery: "Gallery management",
      notifications: "Notification management",
      statistics: "Statistics",
      settings: "Settings",
    },
  };

  const t = translations[language] || translations.es;

  const sectionTitles = {
    users: t.users,
    events: t.events,
    gallery: t.gallery,
    notifications: t.notifications,
    statistics: t.statistics,
    settings: t.settings,
  };

  const renderSection = () => {
    switch (adminSection) {
      case "users":
        return <Users language={language} />;

      case "events":
        return (
          <EventsAdmin
            language={language}
            onEventsUpdated={onEventsUpdated}
          />
        );

      case "gallery":
        return <GalleryAdmin language={language} />;

      case "notifications":
        return (
          <NotificationsAdmin language={language} />
        );

      case "statistics":
        return (
          <StatisticsAdmin language={language} />
        );

      case "settings":
        return <SettingsAdmin language={language} />;

      default:
        return (
          <Dashboard
            events={events}
            gallery={gallery}
            userProfile={userProfile}
            language={language}
            setAdminSection={setAdminSection}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {adminSection !== "dashboard" && (
        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setAdminSection("dashboard")
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
              aria-label={t.backToDashboard}
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <ShieldCheck size={15} />
                {t.adminPanel}
              </div>

              <h1 className="truncate text-lg font-extrabold text-slate-950">
                {sectionTitles[adminSection]}
              </h1>
            </div>
          </div>
        </div>
      )}

      <main
        className={
          adminSection === "dashboard"
            ? "mx-auto w-full max-w-6xl px-4 py-5"
            : "mx-auto w-full max-w-6xl px-4 py-6"
        }
      >
        {renderSection()}
      </main>
    </div>
  );
}

export default AdminDashboard;