import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { API_URL } from "../../config"

const INITIAL_FORM = {
  title: "",
  message: "",
  category: "general",
  priority: "normal",
  type: "general",
  send_in_app: true,
  send_push: true,
  send_email: true,
  is_active: true,
}

function NotificationsAdmin() {
  const [notifications, setNotifications] = useState([])
  const [form, setForm] = useState(INITIAL_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loadingList, setLoadingList] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState(null)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoadingList(true)

      const response = await axios.get(
        `${API_URL}/notifications/admin/all`
      )

      setNotifications(
        Array.isArray(response.data) ? response.data : []
      )
    } catch (error) {
      console.error("LOAD NOTIFICATIONS ERROR:", error)
      alert(getErrorMessage(error, "Error loading notifications."))
    } finally {
      setLoadingList(false)
    }
  }

  const getErrorMessage = (error, fallback) => {
    return (
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      fallback
    )
  }

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setForm(INITIAL_FORM)
    setEditingId(null)
  }

  const saveNotification = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.message.trim()) {
      alert("Please complete the title and message.")
      return
    }

    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      category: form.category,
      priority: form.priority,
      type: form.type,
      related_event_id: null,
      send_in_app: form.send_in_app,
      send_push: form.send_push,
      send_email: form.send_email,
      is_active: form.is_active,
    }

    try {
      setSaving(true)

      if (editingId) {
        await axios.put(
          `${API_URL}/notifications/${editingId}`,
          payload
        )

        alert("Notification updated successfully.")
      } else {
        await axios.post(
          `${API_URL}/notifications/`,
          {
            ...payload,
            status: "draft",
          }
        )

        alert("Notification saved as draft.")
      }

      resetForm()
      await loadNotifications()
    } catch (error) {
      console.error("SAVE NOTIFICATION ERROR:", error)
      alert(getErrorMessage(error, "Error saving notification."))
    } finally {
      setSaving(false)
    }
  }

  const editNotification = (item) => {
    setEditingId(item.id)

    setForm({
      title: item.title || "",
      message: item.message || "",
      category: item.category || item.type || "general",
      priority: item.priority || "normal",
      type: item.type || item.category || "general",
      send_in_app: item.send_in_app ?? true,
      send_push: item.send_push ?? true,
      send_email: item.send_email ?? true,
      is_active: item.is_active ?? true,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const sendNotification = async (item) => {
    const confirmed = window.confirm(
      `Send "${item.title}" now?`
    )

    if (!confirmed) return

    try {
      setActionId(item.id)

      const response = await axios.post(
        `${API_URL}/notifications/${item.id}/send`,
        {
          send_push: item.send_push ?? true,
          send_email: item.send_email ?? true,
        }
      )

      const result = response.data

      alert(
        [
          "Notification delivery completed.",
          `Push sent: ${result.push_sent || 0}`,
          `Email sent: ${result.email_sent || 0}`,
          `Status: ${result.status || "sent"}`,
        ].join("\n")
      )

      await loadNotifications()
    } catch (error) {
      console.error("SEND NOTIFICATION ERROR:", error)
      alert(getErrorMessage(error, "Error sending notification."))
    } finally {
      setActionId(null)
    }
  }

  const sendReminder = async (item) => {
    const confirmed = window.confirm(
      `Send a reminder for "${item.title}"?`
    )

    if (!confirmed) return

    try {
      setActionId(item.id)

      const response = await axios.post(
        `${API_URL}/notifications/${item.id}/reminder`,
        {
          send_push: item.send_push ?? true,
          send_email: item.send_email ?? true,
        }
      )

      const result = response.data

      alert(
        [
          "Reminder completed.",
          `Push sent: ${result.push_sent || 0}`,
          `Email sent: ${result.email_sent || 0}`,
        ].join("\n")
      )

      await loadNotifications()
    } catch (error) {
      console.error("SEND REMINDER ERROR:", error)
      alert(getErrorMessage(error, "Error sending reminder."))
    } finally {
      setActionId(null)
    }
  }

  const toggleVisibility = async (item) => {
    try {
      setActionId(item.id)

      await axios.patch(
        `${API_URL}/notifications/${item.id}/status`,
        {
          is_active: !item.is_active,
        }
      )

      await loadNotifications()
    } catch (error) {
      console.error("STATUS ERROR:", error)
      alert(
        getErrorMessage(
          error,
          "Error changing notification visibility."
        )
      )
    } finally {
      setActionId(null)
    }
  }

  const deleteNotification = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently?`
    )

    if (!confirmed) return

    try {
      setActionId(item.id)

      await axios.delete(
        `${API_URL}/notifications/${item.id}`
      )

      if (editingId === item.id) {
        resetForm()
      }

      await loadNotifications()
    } catch (error) {
      console.error("DELETE ERROR:", error)
      alert(getErrorMessage(error, "Error deleting notification."))
    } finally {
      setActionId(null)
    }
  }

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      drafts: notifications.filter(
        (item) => (item.status || "draft") === "draft"
      ).length,
      sent: notifications.filter(
        (item) => item.status === "sent"
      ).length,
      active: notifications.filter(
        (item) => item.is_active
      ).length,
    }
  }, [notifications])

  const categoryBadge = (value) => {
    switch (value) {
      case "evento":
      case "event":
        return "bg-emerald-100 text-emerald-700"
      case "importante":
      case "important":
        return "bg-rose-100 text-rose-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const statusBadge = (value) => {
    switch (value) {
      case "sent":
        return "bg-emerald-100 text-emerald-700"
      case "partially_sent":
        return "bg-amber-100 text-amber-700"
      case "failed":
        return "bg-rose-100 text-rose-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const formatDate = (date) => {
    if (!date) return "Not sent yet"
    return new Date(date).toLocaleString()
  }

  return (
    <div className="space-y-8 pb-12">
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
          Administration panel
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-blue-950">
          Notification Center
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Create, edit and manually send community communications.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} icon="🔔" />
        <StatCard label="Drafts" value={stats.drafts} icon="📝" />
        <StatCard label="Sent" value={stats.sent} icon="✅" />
        <StatCard label="Active" value={stats.active} icon="👁️" />
      </section>

      <form
        onSubmit={saveNotification}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950">
              {editingId
                ? "Edit notification"
                : "Create notification"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Saving does not send the notification automatically.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="space-y-4">
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                updateForm("title", event.target.value)
              }
              maxLength={150}
              placeholder="Notification title"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </Field>

          <Field label="Message">
            <textarea
              value={form.message}
              onChange={(event) =>
                updateForm("message", event.target.value)
              }
              rows={5}
              placeholder="Write the message for the community"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(event) => {
                  updateForm("category", event.target.value)
                  updateForm("type", event.target.value)
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="general">General</option>
                <option value="evento">Event</option>
                <option value="importante">Important</option>
              </select>
            </Field>

            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(event) =>
                  updateForm("priority", event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </Field>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-slate-700">
              Delivery channels
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              <ChannelToggle
                label="In app"
                description="Visible in notifications"
                checked={form.send_in_app}
                onChange={(value) =>
                  updateForm("send_in_app", value)
                }
              />

              <ChannelToggle
                label="Push"
                description="Send to registered devices"
                checked={form.send_push}
                onChange={(value) =>
                  updateForm("send_push", value)
                }
              />

              <ChannelToggle
                label="Email"
                description="Send with Resend"
                checked={form.send_email}
                onChange={(value) =>
                  updateForm("send_email", value)
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Save changes"
                : "Save draft"}
          </button>
        </div>
      </form>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-blue-950">
            Notification history
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Send, remind, edit or remove saved notifications.
          </p>
        </div>

        {loadingList ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-bold text-slate-700">
              No notifications yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first notification above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => {
              const busy = actionId === item.id
              const itemCategory =
                item.category || item.type || "general"
              const itemStatus = item.status || "draft"

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${categoryBadge(
                            itemCategory
                          )}`}
                        >
                          {itemCategory}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(
                            itemStatus
                          )}`}
                        >
                          {itemStatus.replace("_", " ")}
                        </span>

                        {!item.is_active && (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                            Hidden
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 break-words text-lg font-extrabold text-blue-950">
                        {item.title}
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                        {item.message}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 md:grid-cols-4">
                      <DeliveryStat
                        label="Users"
                        value={item.total_users || 0}
                      />
                      <DeliveryStat
                        label="Push sent"
                        value={item.push_sent || 0}
                      />
                      <DeliveryStat
                        label="Emails sent"
                        value={item.email_sent || 0}
                      />
                      <DeliveryStat
                        label="Created"
                        value={formatDate(item.created_at)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                      <ActionButton
                        label={busy ? "Working..." : "Send"}
                        onClick={() => sendNotification(item)}
                        disabled={busy}
                        className="bg-blue-700 text-white hover:bg-blue-800"
                      />

                      <ActionButton
                        label="Reminder"
                        onClick={() => sendReminder(item)}
                        disabled={busy}
                        className="bg-amber-500 text-white hover:bg-amber-600"
                      />

                      <ActionButton
                        label="Edit"
                        onClick={() => editNotification(item)}
                        disabled={busy}
                        className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      />

                      <ActionButton
                        label={item.is_active ? "Hide" : "Show"}
                        onClick={() => toggleVisibility(item)}
                        disabled={busy}
                        className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      />

                      <ActionButton
                        label="Delete"
                        onClick={() => deleteNotification(item)}
                        disabled={busy}
                        className="bg-rose-600 text-white hover:bg-rose-700"
                      />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
        <span className="text-2xl font-extrabold text-blue-950">
          {value}
        </span>
      </div>

      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  )
}

function ChannelToggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
      <div>
        <p className="text-sm font-bold text-slate-800">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-blue-700"
      />
    </label>
  )
}

function DeliveryStat({ label, value }) {
  return (
    <div>
      <p className="font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-slate-500">{label}</p>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  disabled,
  className,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  )
}

export default NotificationsAdmin