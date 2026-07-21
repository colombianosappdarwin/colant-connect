import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function Notifications({ language = "es", setActiveTab }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/`);
      setNotifications(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "evento":
        return "📅";
      case "importante":
        return "⚠️";
      default:
        return "📢";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      language === "es" ? "es-ES" : "en-AU"
    );
  };

  return (
    <div>
      <button
        onClick={() => setActiveTab("home")}
        className="mb-5 text-blue-700 font-bold"
      >
        ← {language === "es" ? "Volver" : "Back"}
      </button>

      <h1 className="mb-2 text-3xl font-extrabold text-blue-950">
        🔔 {language === "es"
          ? "Notificaciones"
          : "Notifications"}
      </h1>

      <p className="mb-6 text-slate-600">
        {language === "es"
          ? "Mantente informado sobre eventos y novedades de la comunidad."
          : "Stay informed about community events and news."}
      </p>

      {loading ? (
        <div className="py-10 text-center font-semibold text-slate-600">
          {language === "es"
            ? "Cargando..."
            : "Loading..."}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center shadow">
          {language === "es"
            ? "No hay notificaciones."
            : "No notifications available."}
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-5 shadow"
            >
              <div className="flex gap-3">
                <div className="text-3xl">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-bold text-blue-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-slate-700">
                    {item.message}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;