import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://colant-connect-production.up.railway.app";

function Notifications({ onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getIcon = (type) => {
    if (type === "evento") return "📅";
    if (type === "importante") return "⚠️";
    return "📢";
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/notifications/`)
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading notifications:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-blue-700 font-bold"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
          🔔 Notificaciones
        </h1>

        <p className="text-slate-600 mb-6">
          Información importante de COLANT Connect.
        </p>

        {loading && (
          <p className="text-slate-600">Cargando notificaciones...</p>
        )}

        {!loading && notifications.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-slate-600">
              No hay notificaciones disponibles.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow p-5 border border-slate-200"
            >
              <div className="flex gap-4">
                <div className="text-3xl">
                  {getIcon(item.type)}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-blue-950">
                    {item.title}
                  </h2>

                  <p className="text-slate-700 mt-2">
                    {item.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-3">
                    {new Date(item.created_at).toLocaleString()}
                  </p>

                  <span className="inline-block mt-3 text-xs font-bold uppercase bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;