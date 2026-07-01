import { useState } from "react"
import Dashboard from "./admin/Dashboard"
import Users from "./admin/Users"

function AdminDashboard({
  events,
  businesses,
  gallery,
  userProfile
}) {
  const [adminSection, setAdminSection] = useState("dashboard")

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
          businesses={businesses}
          gallery={gallery}
          userProfile={userProfile}
          setAdminSection={setAdminSection}
        />
      )}

      {adminSection === "users" && (
        <Users />
      )}
    </div>
  )
}

export default AdminDashboard