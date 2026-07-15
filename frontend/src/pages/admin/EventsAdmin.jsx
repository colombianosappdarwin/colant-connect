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

function EventsAdmin({ onEventsUpdated }) {
  const fileInputRef = useRef(null)

  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      alert("Error cargando los eventos")
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
      alert("Selecciona una imagen válida.")
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
      alert("Selecciona la imagen principal del evento.")
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
          ? "Evento actualizado correctamente"
          : "Evento creado correctamente"
      )
    } catch (error) {
      console.error(
        "Error saving event:",
        error?.response?.data || error
      )

      alert("Error guardando el evento")
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
      "¿Quieres eliminar este evento?"
    )

    if (!confirmDelete) return

    try {
      await deleteEvent(eventId)
      await loadEvents()
      await onEventsUpdated?.()
    } catch (error) {
      console.error(error)
      alert("Error eliminando el evento")
    }
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return "Sin fecha"

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Contenido
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-slate-950">
            Eventos
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Crea, edita y publica los eventos de la comunidad.
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
              Cancelar
            </>
          ) : (
            <>
              <Plus size={18} />
              Crear evento
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
              {editingId ? "Editar evento" : "Nuevo evento"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Completa la información que verá la comunidad.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Imagen principal
              </label>

              {formData.image_url ? (
                <div className="relative mt-2 overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={formData.image_url}
                    alt="Imagen del evento"
                    className="h-52 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-black/75 px-4 py-2 text-sm font-bold text-white backdrop-blur"
                  >
                    <Camera size={17} />
                    Cambiar imagen
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
                    Seleccionar imagen
                  </span>

                  <span className="mt-1 text-xs">
                    JPG, PNG o WEBP
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
                Título del evento
              </label>

              <input
                name="title"
                type="text"
                placeholder="Ejemplo: Colombia Florece"
                value={formData.title}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Descripción
              </label>

              <textarea
                name="description"
                placeholder="Describe brevemente el evento"
                value={formData.description}
                onChange={handleChange}
                className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Ubicación
              </label>

              <div className="relative mt-2">
                <MapPin
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="location"
                  type="text"
                  placeholder="Ejemplo: Darwin Waterfront"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Fecha y hora
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
                ? "Guardando..."
                : editingId
                  ? "Actualizar evento"
                  : "Publicar evento"}
            </button>
          </div>
        </form>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-slate-950">
            Eventos publicados
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {events.length} evento{events.length === 1 ? "" : "s"}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <CalendarDays
              size={30}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-bold text-slate-800">
              No hay eventos creados
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
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700"
                    >
                      <Trash2 size={17} />
                      Eliminar
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