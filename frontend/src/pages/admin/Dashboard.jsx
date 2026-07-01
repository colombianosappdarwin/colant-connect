import AdminStatCard from "../../components/admin/AdminStatCard";

function Dashboard({
  events,
  gallery,
  userProfile,
  setAdminSection
}) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-slate-500 font-semibold">
          Welcome back
        </p>

        <h1 className="text-3xl font-extrabold text-blue-950">
          {userProfile?.full_name || "Administrator"}
        </h1>

        <p className="text-slate-600 mt-2">
          COLANT Connect Administration Panel
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => setAdminSection("users")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <AdminStatCard
            title="Users"
            value="Manage"
            icon="👥"
            color="bg-blue-600"
          />
        </div>

        <div
          onClick={() => setAdminSection("events")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <AdminStatCard
            title="Events"
            value={events?.length || 0}
            icon="🎉"
            color="bg-green-600"
          />
        </div>

        <div
          onClick={() => setAdminSection("gallery")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <AdminStatCard
            title="Gallery"
            value={gallery?.length || 0}
            icon="📸"
            color="bg-pink-600"
          />
        </div>

        <div
          onClick={() => setAdminSection("notifications")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <AdminStatCard
            title="Notifications"
            value="Send"
            icon="🔔"
            color="bg-red-600"
          />
        </div>

        <div
          onClick={() => setAdminSection("statistics")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <AdminStatCard
            title="Statistics"
            value="View"
            icon="📊"
            color="bg-purple-600"
          />
        </div>

        <div
          onClick={() => setAdminSection("settings")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <AdminStatCard
            title="Settings"
            value="System"
            icon="⚙️"
            color="bg-slate-700"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;