function StatisticsAdmin() {
  const stats = [
    {
      title: "Registered Users",
      value: "120+",
      icon: "👥",
      description: "Community members registered in COLANT Connect.",
    },
    {
      title: "Events",
      value: "1",
      icon: "🎉",
      description: "Active community events managed in the platform.",
    },
    {
      title: "Gallery Photos",
      value: "40+",
      icon: "🖼️",
      description: "Photos connected to events and community activities.",
    },
    {
      title: "Notifications",
      value: "Active",
      icon: "📢",
      description: "General and event-based communication system.",
    },
  ];

  const insights = [
    "Users can be analysed by country, city, industry and visa type.",
    "Event attendance helps measure community engagement.",
    "Gallery activity supports cultural documentation.",
    "Admin data can support future sponsors and grant applications.",
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
        Statistics
      </h1>

      <p className="text-slate-600 mb-6">
        Review user, event and community data.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5"
          >
            <div className="text-3xl mb-3">{item.icon}</div>

            <p className="text-2xl font-extrabold text-blue-950">
              {item.value}
            </p>

            <p className="text-sm font-bold text-slate-800 mt-1">
              {item.title}
            </p>

            <p className="text-xs text-slate-500 mt-2 leading-5">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-blue-950 text-white rounded-3xl p-6 shadow-xl mb-6">
        <h2 className="text-xl font-extrabold mb-3">
          Community Insights
        </h2>

        <p className="text-blue-100 text-sm leading-6">
          COLANT Connect collects structured information that helps understand
          the Colombian community in Australia and supports better planning for
          events, partnerships and community programs.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5">
        <h2 className="text-xl font-extrabold text-blue-950 mb-4">
          Data Collected
        </h2>

        <div className="space-y-3">
          {insights.map((item) => (
            <div
              key={item}
              className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-700"
            >
              ✅ {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatisticsAdmin;