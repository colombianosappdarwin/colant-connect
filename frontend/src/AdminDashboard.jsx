import { useState } from "react";
import AdminEvents from "./AdminEvents";

function AdminDashboard({ userProfile, onBack }) {
  const [page, setPage] = useState("dashboard");

  if (page === "events") {
    return (
      <AdminEvents
        token={localStorage.getItem("token")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-5">
      <button
        onClick={onBack}
        className="mb-5 text-blue-700 font-bold"
      >
        ← Back
      </button>

      <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">

        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-950 flex items-center justify-center text-3xl">
            👑
          </div>

          <div>
            <p className="text-sm text-slate-500 font-semibold">
              Administrator Panel
            </p>

            <h1 className="text-2xl font-extrabold text-blue-950">
              COLANT Admin
            </h1>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 mb-5">
          <p className="text-sm text-slate-500">
            Signed in as
          </p>

          <p className="text-lg font-bold text-slate-900">
            {userProfile?.full_name || "Administrator"}
          </p>

          <p className="text-sm text-slate-500">
            {userProfile?.email}
          </p>
        </div>

        <div className="bg-blue-950 text-white rounded-2xl p-5 mb-5">
          <p className="text-sm opacity-80">
            Access level
          </p>

          <p className="text-2xl font-extrabold">
            {userProfile?.role || "admin"}
          </p>

          <p className="text-sm opacity-80 mt-3">
            Manage the entire COLANT platform from this dashboard.
          </p>
        </div>

        <button
          onClick={() => setPage("events")}
          className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-4">

            <span className="text-4xl">📅</span>

            <div>
              <h2 className="font-bold text-blue-950">
                Manage Events
              </h2>

              <p className="text-sm text-slate-500">
                Create, edit and delete community events.
              </p>
            </div>

          </div>
        </button>

      </div>
    </div>
  );
}

export default AdminDashboard;