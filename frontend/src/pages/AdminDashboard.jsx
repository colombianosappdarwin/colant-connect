import { useState } from "react";

import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import EventsAdmin from "./admin/EventsAdmin";
import GalleryAdmin from "./admin/GalleryAdmin";
import NotificationsAdmin from "./admin/NotificationsAdmin";
import StatisticsAdmin from "./admin/StatisticsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";

function AdminDashboard({
  events,
  gallery,
  userProfile
}) {
  const [adminSection, setAdminSection] = useState("dashboard");

  return (
    <div>
      {adminSection !== "dashboard" && (
        <button
          onClick={() => setAdminSection("dashboard")}
          className="mb-5 text-blue-700 font-bold"
        >
          ← Back to Dashboard
        </button>
      )}

      {adminSection === "dashboard" && (
        <Dashboard
          events={events}
          gallery={gallery}
          userProfile={userProfile}
          setAdminSection={setAdminSection}
        />
      )}

      {adminSection === "users" && <Users />}
      {adminSection === "events" && <EventsAdmin />}
      {adminSection === "gallery" && <GalleryAdmin />}
      {adminSection === "notifications" && <NotificationsAdmin />}
      {adminSection === "statistics" && <StatisticsAdmin />}
      {adminSection === "settings" && <SettingsAdmin />}
    </div>
  );
}

export default AdminDashboard;