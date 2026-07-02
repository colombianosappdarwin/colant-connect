import AdminStatCard from "../../components/admin/AdminStatCard";

function Dashboard({
  events,
  gallery,
  userProfile,
  setAdminSection,
}) {
  const cards = [
    {
      key: "users",
      title: "Users",
      value: "Manage",
      icon: "👥",
      color: "bg-blue-600",
    },
    {
      key: "events",
      title: "Events",
      value: events?.length || 0,
      icon: "🎉",
      color: "bg-green-600",
    },
    {
      key: "gallery",
      title: "Gallery",
      value: gallery?.length || 0,
      icon: "📸",
      color: "bg-pink-600",
    },
    {
      key: "notifications",
      title: "Notifications",
      value: "Send",
      icon: "🔔",
      color: "bg-red-600",
    },
    {
      key: "statistics",
      title: "Statistics",
      value: "View",
      icon: "📊",
      color: "bg-purple-600",
    },
    {
      key: "settings",
      title: "Settings",
      value: "System",
      icon: "⚙️",
      color: "bg-slate-700",
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-6 shadow-xl mb-8">
        <p className="text-blue-200 text-sm font-semibold">
          Welcome back
        </p>

        <h1 className="text-3xl font-extrabold mt-1">
          {userProfile?.full_name || "Administrator"}
        </h1>

        <p className="mt-2 text-blue-100">
          COLANT Connect Administration Panel
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.key}
            onClick={() => setAdminSection(card.key)}
            className="cursor-pointer hover:scale-105 transition"
          >
            <AdminStatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-6">
        <h2 className="text-xl font-extrabold text-blue-950 mb-4">
          Quick Overview
        </h2>

        <div className="grid gap-3">
          <div className="bg-slate-50 rounded-2xl p-4">
            👥 User management and role administration.
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            🎉 Community events management.
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            📸 Gallery connected with Cloudinary.
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            📊 Statistics and community analytics.
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            🔔 Community notifications.
          </div>
        </div>
      </div>

      <div className="bg-blue-950 rounded-3xl p-6 text-white shadow-xl">
        <h2 className="text-xl font-extrabold mb-3">
          COLANT Connect v1.0
        </h2>

        <p className="text-blue-100 leading-7">
          Administration platform for the Colombian community in Australia,
          including user management, events, gallery, notifications,
          statistics and community information.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;