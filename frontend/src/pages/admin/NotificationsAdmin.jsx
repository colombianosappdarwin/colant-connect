import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../../config"

function NotificationsAdmin() {
  const [notifications, setNotifications] = useState([])
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("general")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/`)
      setNotifications(response.data)
    } catch (error) {
      console.error(error)
      alert("Error loading notifications.")
    }
  }

  const createNotification = async (e) => {
    e.preventDefault()

    if (!title.trim() || !message.trim()) {
      alert("Please complete all fields.")
      return
    }

    try {
      setLoading(true)

      await axios.post(`${API_URL}/notifications/`, {
        title,
        message,
        type,
        related_event_id: null,
        is_active: true,
      })

      setTitle("")
      setMessage("")
      setType("general")

      await loadNotifications()

      alert("Notification published successfully.")
    } catch (error) {
      console.error(error)
      alert("Error publishing notification.")
    } finally {
      setLoading(false)
    }
  }

  const badgeColor = (type) => {
    switch (type) {
      case "evento":
        return "bg-green-100 text-green-700"
      case "importante":
        return "bg-red-100 text-red-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
        🔔 Notifications
      </h1>

      <p className="text-slate-600 mb-6">
        Create and manage community notifications.
      </p>

      <form
        onSubmit={createNotification}
        className="bg-white rounded-2xl shadow p-6 mb-8 space-y-4"
      >
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded-xl p-3"
          rows="4"
          placeholder="Notification message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <select
          className="w-full border rounded-xl p-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="general">📢 General</option>
          <option value="evento">📅 Event</option>
          <option value="importante">⚠️ Important</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl"
        >
          {loading ? "Publishing..." : "Publish Notification"}
        </button>
      </form>

      <h2 className="text-xl font-bold text-blue-950 mb-4">
        Notification History
      </h2>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-2xl shadow p-5"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-blue-950">
                {item.title}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor(
                  item.type
                )}`}
              >
                {item.type}
              </span>
            </div>

            <p className="mt-3 text-slate-700">
              {item.message}
            </p>

            <p className="mt-4 text-xs text-slate-400">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsAdmin