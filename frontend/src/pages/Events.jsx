import { useEffect, useState } from "react"
import axios from "axios"
import { texts } from "../translations"
import { API_URL } from "../config"

const FESTIVAL_IMAGE =
  "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png"

function Events({
  events = [],
  businesses = [],
  userProfile,
  language = "es",
}) {
  const t = texts[language]

  const [attendeeCounts, setAttendeeCounts] = useState({})
  const [joinedEvents, setJoinedEvents] = useState({})

  useEffect(() => {
    const loadAttendees = async () => {
      try {
        const counts = {}

        for (const event of events) {
          const response = await axios.get(
            `${API_URL}/events/${event.id}/attendees`
          )

          counts[event.id] = response.data.count || 0
        }

        setAttendeeCounts(counts)
      } catch (error) {
        console.error("Error loading attendees:", error)
      }
    }

    if (events.length > 0) {
      loadAttendees()
    }
  }, [events])

  const handleAttendEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        alert(
          language === "es"
            ? "Debes iniciar sesión primero"
            : "You must login first"
        )
        return
      }

      const response = await axios.post(
        `${API_URL}/events/${eventId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const alreadyJoined =
        response.data?.message === "Already joined"

      setJoinedEvents((previous) => ({
        ...previous,
        [eventId]: true,
      }))

      if (!alreadyJoined) {
        setAttendeeCounts((previous) => ({
          ...previous,
          [eventId]: (previous[eventId] || 0) + 1,
        }))
      }
    } catch (error) {
      console.error("Error joining event:", error)

      alert(
        language === "es"
          ? "Error al confirmar asistencia"
          : "Error joining the event"
      )
    }
  }

  const handleOpenMaps = (location) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location || "Darwin"
    )}`

    window.open(mapsUrl, "_blank", "noopener,noreferrer")
  }

  const formatEventDate = (dateValue) => {
    if (!dateValue) return null

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return null
    }

    return new Intl.DateTimeFormat(
      language === "es" ? "es-AU" : "en-AU",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(date)
  }

  const formatEventTime = (dateValue) => {
    if (!dateValue) return null

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return null
    }

    return new Intl.DateTimeFormat(
      language === "es" ? "es-AU" : "en-AU",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(date)
  }

  return (
    <>
      <h3 className="mb-5 text-3xl font-extrabold text-blue-950">
        {t.events || (language === "es" ? "Eventos" : "Events")}
      </h3>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-bold text-slate-800">
            {language === "es"
              ? "No hay eventos disponibles"
              : "No events available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {events.map((event) => {
            const eventBusinesses = businesses.filter(
              (business) => business.event_id === event.id
            )

            const isJoined = joinedEvents[event.id]
            const count = attendeeCounts[event.id] || 0
            const formattedDate = formatEventDate(event.event_date)
            const formattedTime = formatEventTime(event.event_date)

            return (
              <article
                key={event.id}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl"
              >
                <img
                  src={event.image_url || FESTIVAL_IMAGE}
                  alt={event.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <p className="mb-2 text-xs font-bold uppercase text-blue-700">
                    {language === "es"
                      ? "Evento de la comunidad"
                      : "Community event"}
                  </p>

                  <h3 className="text-2xl font-extrabold leading-tight text-blue-950">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-4 grid gap-2 text-sm text-slate-700">
                    {formattedDate && (
                      <p>📅 {formattedDate}</p>
                    )}

                    {formattedTime && (
                      <p>🕓 {formattedTime}</p>
                    )}

                    <p>
                      📍 {event.location || "Darwin"}
                    </p>

                    <p>
                      👥{" "}
                      {language === "es"
                        ? "Comunidad COLANT"
                        : "COLANT Community"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                      <span>
                        👥 {count}{" "}
                        {language === "es"
                          ? "asistentes"
                          : "attending"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenMaps(event.location)
                        }
                        className="font-semibold text-blue-700 hover:text-blue-900"
                      >
                        📍{" "}
                        {language === "es"
                          ? "Abrir en Maps"
                          : "Open in Maps"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleAttendEvent(event.id)
                      }
                      disabled={isJoined}
                      className={`w-full rounded-2xl py-4 text-lg font-bold shadow-lg transition-all duration-300 ${
                        isJoined
                          ? "bg-green-600 text-white"
                          : "bg-blue-700 text-white hover:bg-blue-800"
                      }`}
                    >
                      {isJoined
                        ? language === "es"
                          ? "✔ Asistencia confirmada"
                          : "✔ You're Attending"
                        : language === "es"
                          ? "✅ Asistir al evento"
                          : "✅ Attend Event"}
                    </button>
                  </div>

                  {eventBusinesses.length > 0 && (
                    <div className="mt-4 rounded-xl bg-yellow-50 p-3">
                      <h4 className="mb-2 font-bold text-yellow-800">
                        {t.businessesPresent}
                      </h4>

                      <div className="grid gap-2">
                        {eventBusinesses.map((business) => (
                          <div
                            key={business.id}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={
                                business.image_url ||
                                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                              }
                              alt={business.business_name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />

                            <div>
                              <p className="text-sm font-bold">
                                {business.business_name}
                              </p>

                              <p className="text-xs text-gray-600">
                                {business.category} ·{" "}
                                {business.stand_location ||
                                  t.standPending}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {userProfile?.role === "admin" && (
                    <div className="mt-4 rounded-2xl bg-slate-100 p-4">
                      <p className="text-sm font-bold text-blue-950">
                        {language === "es"
                          ? "Herramientas de administrador"
                          : "Admin Tools"}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {language === "es"
                          ? "La administración del evento está disponible desde el panel administrativo."
                          : "Event management is available from the administrator dashboard."}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Events