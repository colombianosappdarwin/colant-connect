import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function Notifications({ language, setActiveTab }) {
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

  return (
    <div>
      <button
        onClick={() => setActiveTab("home")}
        className="mb-5 text-blue-700 font-bold"
      >
        ← {language === "es" ? "Volver" : "Back"}
      </button>

      <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
        🔔 {language === "es" ? "Notificaciones" : "Notifications"}
      </h1>

      <p className="text-slate-600 mb-6">
        {language === "es"
          ? "Mantente informado sobre eventos y novedades."
          : "Stay informed about events and community news."}
      </p>

      {loading ? (
        <div className="text-center py-10">
          Cargando...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          No hay notificaciones.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-5 border"
            >
              <div className="flex gap-3">
                <div className="text-3xl">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-blue-900 text-lg">
                    {item.title}
                  </h2>

                  <p className="text-slate-700 mt-2">
                    {item.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-3">
                    {new Date(item.created_at).toLocaleString()}
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