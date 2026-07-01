import AdminStatCard from "../../components/admin/AdminStatCard"

function Dashboard({
  events,
  businesses,
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
          Manage COLANT Connect from one place.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4">

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
            title="Photos"
            value={gallery?.length || 0}
            icon="📸"
            color="bg-pink-600"
          />
        </div>

        <div
          onClick={() => setAdminSection("businesses")}
          className="cursor-pointer hover:scale-105 transition"
        >
          <AdminStatCard
            title="Businesses"
            value={businesses?.length || 0}
            icon="🏪"
            color="bg-orange-500"
          />
        </div>

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

      </div>

    </div>
  )
}

export default Dashboard