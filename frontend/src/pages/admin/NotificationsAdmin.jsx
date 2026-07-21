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

function NotificationsAdmin({ language = "es" }) {
  const [notifications, setNotifications] = useState([])
  const [form, setForm] = useState(INITIAL_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loadingList, setLoadingList] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState(null)

  const translations = {
    es: {
      loadError: "Error cargando las notificaciones.",
      completeFields: "Completa el título y el mensaje.",
      updatedSuccess: "Notificación actualizada correctamente.",
      draftSaved: "Notificación guardada como borrador.",
      saveError: "Error guardando la notificación.",
      sendConfirm: (title) => `¿Enviar "${title}" ahora?`,
      deliveryCompleted: "Envío de la notificación completado.",
      pushSent: "Notificaciones push enviadas",
      emailSent: "Correos enviados",
      status: "Estado",
      sentStatus: "enviada",
      sendError: "Error enviando la notificación.",
      reminderConfirm: (title) =>
        `¿Enviar un recordatorio para "${title}"?`,
      reminderCompleted: "Recordatorio completado.",
      reminderError: "Error enviando el recordatorio.",
      visibilityError:
        "Error cambiando la visibilidad de la notificación.",
      deleteConfirm: (title) =>
        `¿Eliminar "${title}" permanentemente?`,
      deleteError: "Error eliminando la notificación.",
      notSentYet: "Aún no enviada",
      adminPanel: "Panel de administración",
      notificationCenter: "Centro de notificaciones",
      intro:
        "Crea, edita y envía manualmente comunicaciones para la comunidad.",
      total: "Total",
      drafts: "Borradores",
      sent: "Enviadas",
      active: "Activas",
      editNotification: "Editar notificación",
      createNotification: "Crear notificación",
      saveDoesNotSend:
        "Guardar no envía la notificación automáticamente.",
      cancel: "Cancelar",
      title: "Título",
      titlePlaceholder: "Título de la notificación",
      message: "Mensaje",
      messagePlaceholder: "Escribe el mensaje para la comunidad",
      category: "Categoría",
      general: "General",
      event: "Evento",
      important: "Importante",
      priority: "Prioridad",
      normal: "Normal",
      high: "Alta",
      urgent: "Urgente",
      deliveryChannels: "Canales de envío",
      inApp: "Dentro de la app",
      inAppDescription: "Visible en notificaciones",
      push: "Push",
      pushDescription: "Enviar a dispositivos registrados",
      email: "Correo",
      emailDescription: "Enviar mediante Resend",
      saving: "Guardando...",
      saveChanges: "Guardar cambios",
      saveDraft: "Guardar borrador",
      history: "Historial de notificaciones",
      historyDescription:
        "Envía, recuerda, edita o elimina las notificaciones guardadas.",
      loading: "Cargando notificaciones...",
      noNotifications: "Todavía no hay notificaciones",
      noNotificationsDescription:
        "Crea tu primera notificación en el formulario anterior.",
      hidden: "Oculta",
      users: "Usuarios",
      emailsSent: "Correos enviados",
      created: "Creada",
      working: "Procesando...",
      send: "Enviar",
      reminder: "Recordatorio",
      edit: "Editar",
      hide: "Ocultar",
      show: "Mostrar",
      delete: "Eliminar",
      draft: "Borrador",
      partiallySent: "Enviada parcialmente",
      failed: "Fallida",
    },
    en: {
      loadError: "Error loading notifications.",
      completeFields: "Please complete the title and message.",
      updatedSuccess: "Notification updated successfully.",
      draftSaved: "Notification saved as draft.",
      saveError: "Error saving notification.",
      sendConfirm: (title) => `Send "${title}" now?`,
      deliveryCompleted: "Notification delivery completed.",
      pushSent: "Push sent",
      emailSent: "Email sent",
      status: "Status",
      sentStatus: "sent",
      sendError: "Error sending notification.",
      reminderConfirm: (title) =>
        `Send a reminder for "${title}"?`,
      reminderCompleted: "Reminder completed.",
      reminderError: "Error sending reminder.",
      visibilityError:
        "Error changing notification visibility.",
      deleteConfirm: (title) =>
        `Delete "${title}" permanently?`,
      deleteError: "Error deleting notification.",
      notSentYet: "Not sent yet",
      adminPanel: "Administration panel",
      notificationCenter: "Notification Center",
      intro:
        "Create, edit and manually send community communications.",
      total: "Total",
      drafts: "Drafts",
      sent: "Sent",
      active: "Active",
      editNotification: "Edit notification",
      createNotification: "Create notification",
      saveDoesNotSend:
        "Saving does not send the notification automatically.",
      cancel: "Cancel",
      title: "Title",
      titlePlaceholder: "Notification title",
      message: "Message",
      messagePlaceholder: "Write the message for the community",
      category: "Category",
      general: "General",
      event: "Event",
      important: "Important",
      priority: "Priority",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
      deliveryChannels: "Delivery channels",
      inApp: "In app",
      inAppDescription: "Visible in notifications",
      push: "Push",
      pushDescription: "Send to registered devices",
      email: "Email",
      emailDescription: "Send with Resend",
      saving: "Saving...",
      saveChanges: "Save changes",
      saveDraft: "Save draft",
      history: "Notification history",
      historyDescription:
        "Send, remind, edit or remove saved notifications.",
      loading: "Loading notifications...",
      noNotifications: "No notifications yet",
      noNotificationsDescription:
        "Create your first notification above.",
      hidden: "Hidden",
      users: "Users",
      emailsSent: "Emails sent",
      created: "Created",
      working: "Working...",
      send: "Send",
      reminder: "Reminder",
      edit: "Edit",
      hide: "Hide",
      show: "Show",
      delete: "Delete",
      draft: "Draft",
      partiallySent: "Partially sent",
      failed: "Failed",
    },
  }

  const t = translations[language] || translations.es

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
      alert(getErrorMessage(error, t.loadError))
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
      alert(t.completeFields)
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

        alert(t.updatedSuccess)
      } else {
        await axios.post(
          `${API_URL}/notifications/`,
          {
            ...payload,
            status: "draft",
          }
        )

        alert(t.draftSaved)
      }

      resetForm()
      await loadNotifications()
    } catch (error) {
      console.error("SAVE NOTIFICATION ERROR:", error)
      alert(getErrorMessage(error, t.saveError))
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
      t.sendConfirm(item.title)
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
          t.deliveryCompleted,
          `${t.pushSent}: ${result.push_sent || 0}`,
          `${t.emailSent}: ${result.email_sent || 0}`,
          `${t.status}: ${result.status || t.sentStatus}`,
        ].join("\n")
      )

      await loadNotifications()
    } catch (error) {
      console.error("SEND NOTIFICATION ERROR:", error)
      alert(getErrorMessage(error, t.sendError))
    } finally {
      setActionId(null)
    }
  }

  const sendReminder = async (item) => {
    const confirmed = window.confirm(
      t.reminderConfirm(item.title)
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
          t.reminderCompleted,
          `${t.pushSent}: ${result.push_sent || 0}`,
          `${t.emailSent}: ${result.email_sent || 0}`,
        ].join("\n")
      )

      await loadNotifications()
    } catch (error) {
      console.error("SEND REMINDER ERROR:", error)
      alert(getErrorMessage(error, t.reminderError))
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
          t.visibilityError
        )
      )
    } finally {
      setActionId(null)
    }
  }

  const deleteNotification = async (item) => {
    const confirmed = window.confirm(
      t.deleteConfirm(item.title)
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
      alert(getErrorMessage(error, t.deleteError))
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

  const translateCategory = (value) => {
    switch (value) {
      case "evento":
      case "event":
        return t.event
      case "importante":
      case "important":
        return t.important
      default:
        return t.general
    }
  }

  const translateStatus = (value) => {
    switch (value) {
      case "sent":
        return t.sent
      case "partially_sent":
        return t.partiallySent
      case "failed":
        return t.failed
      default:
        return t.draft
    }
  }

  const formatDate = (date) => {
    if (!date) return t.notSentYet

    return new Intl.DateTimeFormat(
      language === "es" ? "es-AU" : "en-AU",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(new Date(date))
  }

  return (
    <div className="space-y-8 pb-12">
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
          {t.adminPanel}
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-blue-950">
          {t.notificationCenter}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {t.intro}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={t.total} value={stats.total} icon="🔔" />
        <StatCard label={t.drafts} value={stats.drafts} icon="📝" />
        <StatCard label={t.sent} value={stats.sent} icon="✅" />
        <StatCard label={t.active} value={stats.active} icon="👁️" />
      </section>

      <form
        onSubmit={saveNotification}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950">
              {editingId
                ? t.editNotification
                : t.createNotification}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t.saveDoesNotSend}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
            >
              {t.cancel}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <Field label={t.title}>
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                updateForm("title", event.target.value)
              }
              maxLength={150}
              placeholder={t.titlePlaceholder}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </Field>

          <Field label={t.message}>
            <textarea
              value={form.message}
              onChange={(event) =>
                updateForm("message", event.target.value)
              }
              rows={5}
              placeholder={t.messagePlaceholder}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t.category}>
              <select
                value={form.category}
                onChange={(event) => {
                  updateForm("category", event.target.value)
                  updateForm("type", event.target.value)
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="general">{t.general}</option>
                <option value="evento">{t.event}</option>
                <option value="importante">{t.important}</option>
              </select>
            </Field>

            <Field label={t.priority}>
              <select
                value={form.priority}
                onChange={(event) =>
                  updateForm("priority", event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="normal">{t.normal}</option>
                <option value="high">{t.high}</option>
                <option value="urgent">{t.urgent}</option>
              </select>
            </Field>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-slate-700">
              {t.deliveryChannels}
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              <ChannelToggle
                label={t.inApp}
                description={t.inAppDescription}
                checked={form.send_in_app}
                onChange={(value) =>
                  updateForm("send_in_app", value)
                }
              />

              <ChannelToggle
                label={t.push}
                description={t.pushDescription}
                checked={form.send_push}
                onChange={(value) =>
                  updateForm("send_push", value)
                }
              />

              <ChannelToggle
                label={t.email}
                description={t.emailDescription}
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
              ? t.saving
              : editingId
                ? t.saveChanges
                : t.saveDraft}
          </button>
        </div>
      </form>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-blue-950">
            {t.history}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t.historyDescription}
          </p>
        </div>

        {loadingList ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {t.loading}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-bold text-slate-700">
              {t.noNotifications}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {t.noNotificationsDescription}
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
                          {translateCategory(itemCategory)}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(
                            itemStatus
                          )}`}
                        >
                          {translateStatus(itemStatus)}
                        </span>

                        {!item.is_active && (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                            {t.hidden}
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
                        label={t.users}
                        value={item.total_users || 0}
                      />
                      <DeliveryStat
                        label={t.pushSent}
                        value={item.push_sent || 0}
                      />
                      <DeliveryStat
                        label={t.emailsSent}
                        value={item.email_sent || 0}
                      />
                      <DeliveryStat
                        label={t.created}
                        value={formatDate(item.created_at)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                      <ActionButton
                        label={busy ? t.working : t.send}
                        onClick={() => sendNotification(item)}
                        disabled={busy}
                        className="bg-blue-700 text-white hover:bg-blue-800"
                      />

                      <ActionButton
                        label={t.reminder}
                        onClick={() => sendReminder(item)}
                        disabled={busy}
                        className="bg-amber-500 text-white hover:bg-amber-600"
                      />

                      <ActionButton
                        label={t.edit}
                        onClick={() => editNotification(item)}
                        disabled={busy}
                        className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      />

                      <ActionButton
                        label={item.is_active ? t.hide : t.show}
                        onClick={() => toggleVisibility(item)}
                        disabled={busy}
                        className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      />

                      <ActionButton
                        label={t.delete}
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