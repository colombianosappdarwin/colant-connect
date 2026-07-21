import { useEffect, useRef, useState } from "react"
import {
  CalendarDays,
  Camera,
  Edit3,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/eventService"

const emptyForm = {
  title: "",
  description: "",
  location: "",
  event_date: "",
  image: null,
  image_url: "",
}

function EventsAdmin({
  onEventsUpdated,
  language = "es",
}) {
  const fileInputRef = useRef(null)

  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const translations = {
    es: {
      loadError: "Error cargando los eventos",
      invalidImage: "Selecciona una imagen válida.",
      imageRequired: "Selecciona la imagen principal del evento.",
      updatedSuccess: "Evento actualizado correctamente",
      createdSuccess: "Evento creado correctamente",
      saveError: "Error guardando el evento",
      deleteConfirm: "¿Quieres eliminar este evento?",
      deleteError: "Error eliminando el evento",
      noDate: "Sin fecha",
      content: "Contenido",
      title: "Eventos",
      subtitle: "Crea, edita y publica los eventos de la comunidad.",
      cancel: "Cancelar",
      createEvent: "Crear evento",
      editEvent: "Editar evento",
      newEvent: "Nuevo evento",
      formDescription: "Completa la información que verá la comunidad.",
      mainImage: "Imagen principal",
      imageAlt: "Imagen del evento",
      changeImage: "Cambiar imagen",
      selectImage: "Seleccionar imagen",
      eventTitle: "Título del evento",
      eventTitlePlaceholder: "Ejemplo: Colombia Florece",
      description: "Descripción",
      descriptionPlaceholder: "Describe brevemente el evento",
      location: "Ubicación",
      locationPlaceholder: "Ejemplo: Darwin Waterfront",
      dateTime: "Fecha y hora",
      saving: "Guardando...",
      updateEvent: "Actualizar evento",
      publishEvent: "Publicar evento",
      publishedEvents: "Eventos publicados",
      eventSingular: "evento",
      eventPlural: "eventos",
      noEvents: "No hay eventos creados",
      edit: "Editar",
      delete: "Eliminar",
    },
    en: {
      loadError: "Error loading events",
      invalidImage: "Select a valid image.",
      imageRequired: "Select the main event image.",
      updatedSuccess: "Event updated successfully",
      createdSuccess: "Event created successfully",
      saveError: "Error saving the event",
      deleteConfirm: "Do you want to delete this event?",
      deleteError: "Error deleting the event",
      noDate: "No date",
      content: "Content",
      title: "Events",
      subtitle: "Create, edit and publish community events.",
      cancel: "Cancel",
      createEvent: "Create event",
      editEvent: "Edit event",
      newEvent: "New event",
      formDescription: "Complete the information the community will see.",
      mainImage: "Main image",
      imageAlt: "Event image",
      changeImage: "Change image",
      selectImage: "Select image",
      eventTitle: "Event title",
      eventTitlePlaceholder: "Example: Colombia Florece",
      description: "Description",
      descriptionPlaceholder: "Briefly describe the event",
      location: "Location",
      locationPlaceholder: "Example: Darwin Waterfront",
      dateTime: "Date and time",
      saving: "Saving...",
      updateEvent: "Update event",
      publishEvent: "Publish event",
      publishedEvents: "Published events",
      eventSingular: "event",
      eventPlural: "events",
      noEvents: "No events created",
      edit: "Edit",
      delete: "Delete",
    },
  }

  const t = translations[language] || translations.es

  const loadEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      alert(t.loadError)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const clearPreview = () => {
    if (
      formData.image_url &&
      formData.image_url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(formData.image_url)
    }
  }

  const resetForm = () => {
    clearPreview()
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert(t.invalidImage)
      return
    }

    clearPreview()

    setFormData((previous) => ({
      ...previous,
      image: file,
      image_url: URL.createObjectURL(file),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!editingId && !formData.image) {
      alert(t.imageRequired)
      return
    }

    const wasEditing = Boolean(editingId)

    try {
      setSaving(true)

      if (wasEditing) {
        await updateEvent(editingId, formData)
      } else {
        await createEvent(formData)
      }

      await loadEvents()
      await onEventsUpdated?.()

      resetForm()

      alert(
        wasEditing
          ? t.updatedSuccess
          : t.createdSuccess
      )
    } catch (error) {
      console.error(
        "Error saving event:",
        error?.response?.data || error
      )

      alert(t.saveError)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (event) => {
    clearPreview()
    setEditingId(event.id)

    setFormData({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      event_date: event.event_date
        ? event.event_date.slice(0, 16)
        : "",
      image: null,
      image_url: event.image_url || "",
    })

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      t.deleteConfirm
    )

    if (!confirmDelete) return

    try {
      await deleteEvent(eventId)
      await loadEvents()
      await onEventsUpdated?.()
    } catch (error) {
      console.error(error)
      alert(t.deleteError)
    }
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return t.noDate

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return new Intl.DateTimeFormat(
      language === "es" ? "es-ES" : "en-AU",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(date)
  }

  const eventCountLabel =
    events.length === 1
      ? t.eventSingular
      : t.eventPlural

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {t.content}
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-slate-950">
            {t.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {t.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setFormData(emptyForm)
              setEditingId(null)
              setShowForm(true)
            }
          }}
          className="flex shrink-0 items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
        >
          {showForm ? (
            <>
              <X size={18} />
              {t.cancel}
            </>
          ) : (
            <>
              <Plus size={18} />
              {t.createEvent}
            </>
          )}
        </button>
      </section>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-extrabold text-slate-950">
              {editingId ? t.editEvent : t.newEvent}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t.formDescription}
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label className="text-sm font-bold text-slate-700">
                {t.mainImage}
              </label>

              {formData.image_url ? (
                <div className="relative mt-2 overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={formData.image_url}
                    alt={t.imageAlt}
                    className="h-52 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-black/75 px-4 py-2 text-sm font-bold text-white backdrop-blur"
                  >
                    <Camera size={17} />
                    {t.changeImage}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="mt-2 flex h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-slate-400 hover:bg-slate-100"
                >
                  <Camera size={30} />

                  <span className="mt-3 font-bold text-slate-700">
                    {t.selectImage}
                  </span>

                  <span className="mt-1 text-xs">
                    JPG, PNG or WEBP
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                {t.eventTitle}
              </label>

              <input
                name="title"
                type="text"
                placeholder={t.eventTitlePlaceholder}
                value={formData.title}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                {t.description}
              </label>

              <textarea
                name="description"
                placeholder={t.descriptionPlaceholder}
                value={formData.description}
                onChange={handleChange}
                className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                {t.location}
              </label>

              <div className="relative mt-2">
                <MapPin
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="location"
                  type="text"
                  placeholder={t.locationPlaceholder}
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                {t.dateTime}
              </label>

              <div className="relative mt-2">
                <CalendarDays
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-slate-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving
                ? t.saving
                : editingId
                  ? t.updateEvent
                  : t.publishEvent}
            </button>
          </div>
        </form>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-slate-950">
            {t.publishedEvents}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {events.length} {eventCountLabel}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <CalendarDays
              size={30}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-bold text-slate-800">
              {t.noEvents}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-44 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <h3 className="text-xl font-extrabold text-slate-950">
                    {event.title}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(event)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Edit3 size={17} />
                      {t.edit}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700"
                    >
                      <Trash2 size={17} />
                      {t.delete}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default EventsAdmin