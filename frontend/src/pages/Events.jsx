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

  const visibleEvents = events

  useEffect(() => {
    const loadAttendees = async () => {
      try {
        const counts = {}

        for (const event of visibleEvents) {
          const response = await axios.get(
            `${API_URL}/events/${event.id}/attendees`
          )

          counts[event.id] = response.data.count
        }

        setAttendeeCounts(counts)
      } catch (error) {
        console.error("Error loading attendees:", error)
      }
    }

    if (visibleEvents.length > 0) {
      loadAttendees()
    }
  }, [visibleEvents])

  const handleAttendEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        alert("You must login first")
        return
      }

      await axios.post(
        `${API_URL}/events/${eventId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setJoinedEvents((prev) => ({
        ...prev,
        [eventId]: true,
      }))

      setAttendeeCounts((prev) => ({
        ...prev,
        [eventId]: (prev[eventId] || 0) + 1,
      }))
    } catch (error) {
      console.error("Error joining event:", error)
      alert("Error joining the event")
    }
  }

  const handleOpenMaps = (location) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location || "Darwin Waterfront"
    )}`

    window.open(mapsUrl, "_blank")
  }

  return (
    <>
      <h3 className="text-3xl font-extrabold text-blue-950 mb-5">
        {t.events || "Events"}
      </h3>

      <div className="grid gap-5">
        {visibleEvents.map((event) => {
          const eventBusinesses = businesses.filter(
            (business) => business.event_id === event.id
          )

          const isJoined = joinedEvents[event.id]
          const count = attendeeCounts[event.id] || 0

          return (
            <div
              key={event.id}
              className="bg-white rounded-[28px] shadow-xl border border-slate-200 overflow-hidden"
            >
              <img
                src={event.image_url || FESTIVAL_IMAGE}
                alt={event.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <p className="text-xs font-bold text-blue-700 uppercase mb-2">
                  Colombia Florece Festival
                </p>

                <h3 className="font-extrabold text-2xl text-blue-950 leading-tight">
                  {event.title}
                </h3>

                <p className="text-gray-600 text-sm mt-2 leading-6">
                  {event.description}
                </p>

                <div className="grid gap-2 mt-4 text-sm text-slate-700">
                  <p>📅 Saturday 11 July 2026</p>
                  <p>🕓 4 PM - 10 PM</p>
                  <p>📍 {event.location || "Darwin Waterfront"}</p>
                  <p>👥 Comunidad COLANT</p>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <span>👥 {count} attending</span>

                    <button
                      type="button"
                      onClick={() => handleOpenMaps(event.location)}
                      className="text-blue-700 hover:text-blue-900 font-semibold"
                    >
                      📍 Open in Maps
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAttendEvent(event.id)}
                    disabled={isJoined}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
                      isJoined
                        ? "bg-green-600 text-white"
                        : "bg-blue-700 hover:bg-blue-800 text-white"
                    }`}
                  >
                    {isJoined ? "✔ You're Attending" : "✅ Attend Event"}
                  </button>
                </div>

                {eventBusinesses.length > 0 && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded-xl">
                    <h4 className="font-bold text-yellow-800 mb-2">
                      {t.businessesPresent}
                    </h4>

                    <div className="grid gap-2">
                      {eventBusinesses.map((business) => (
                        <div
                          key={business.id}
                          className="flex gap-2 items-center"
                        >
                          <img
                            src={
                              business.image_url ||
                              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                            }
                            alt={business.business_name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />

                          <div>
                            <p className="font-bold text-sm">
                              {business.business_name}
                            </p>

                            <p className="text-xs text-gray-600">
                              {business.category} ·{" "}
                              {business.stand_location || t.standPending}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userProfile?.role === "admin" && (
                  <div className="mt-4 bg-slate-100 rounded-2xl p-4">
                    <p className="font-bold text-blue-950 text-sm">
                      Admin Tools
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Event management is available from the administrator
                      dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Events