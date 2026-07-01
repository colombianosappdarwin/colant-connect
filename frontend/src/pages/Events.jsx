import { useState } from "react"
import axios from "axios"
import { texts } from "../translations"
import { API_URL } from "../config";

const FESTIVAL_IMAGE =
  "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png"

function Events({
  events,
  setEvents,
  businesses,
  attendeesByEvent,
  setAttendeesByEvent,
  galleryByEvent,
  setGalleryByEvent,
  userProfile,
  language = "es"
}) {
  const t = texts[language]

  const ADMIN_EMAIL = "jeison@gmail.com"

  const isAdmin =
    userProfile?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [eventDate, setEventDate] = useState("")

  const joinEvent = async (eventId) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert(t.mustLogin)
      return
    }

    try {
      const response = await axios.post(
        `${API_URL}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert(response.data.message)

      if (isAdmin) {
        loadAttendees(eventId)
      }
    } catch (error) {
      console.log(error)
      alert(t.joinError)
    }
  }

  const loadAttendees = async (eventId) => {
    if (!isAdmin) {
      alert("No tienes permiso para ver asistentes.")
      return
    }

    try {
      const response = await axios.get(
        `${API_URL}`
      )

      setAttendeesByEvent((prev) => ({
        ...prev,
        [eventId]: response.data
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const loadGallery = async (eventId) => {
    if (!isAdmin) {
      alert("No tienes permiso para administrar fotos.")
      return
    }

    try {
      const response = await axios.get(
        `${API_URL}`
      )

      setGalleryByEvent((prev) => ({
        ...prev,
        [eventId]: response.data
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const createEvent = async () => {
    if (!isAdmin) {
      alert("No tienes permiso para crear eventos.")
      return
    }

    try {
      const response = await axios.post(
        "${API_URL}",
        {
          title,
          description,
          location,
          event_date: new Date(eventDate).toISOString()
        }
      )

      setEvents([...events, response.data])

      setTitle("")
      setDescription("")
      setLocation("")
      setEventDate("")
    } catch (error) {
      console.log(error)
      alert("Error al crear el evento.")
    }
  }

  return (
    <>
      <h3 className="text-3xl font-extrabold text-blue-950 mb-5">
        {t.events}
      </h3>

      {isAdmin && (
        <div className="bg-gray-100 p-4 rounded-2xl mb-6">
          <h4 className="font-bold mb-3">
            {t.createEvent}
          </h4>

          <input
            placeholder={t.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-2 rounded-xl border"
          />

          <input
            placeholder={t.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-2 rounded-xl border"
          />

          <input
            placeholder={t.city}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 mb-2 rounded-xl border"
          />

          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-3 mb-3 rounded-xl border"
          />

          <button
            onClick={createEvent}
            className="bg-green-600 text-white w-full py-3 rounded-xl font-bold"
          >
            {t.createEvent}
          </button>
        </div>
      )}

      <div className="grid gap-5">
        {events.map((event) => {
          const eventBusinesses = businesses.filter(
            (business) => business.event_id === event.id
          )

          return (
            <div
              key={event.id}
              className="bg-white rounded-[28px] shadow-xl border border-slate-200 overflow-hidden"
            >
              <img
                src={FESTIVAL_IMAGE}
                alt="Colombia Florece"
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
                  <p>📍 {event.location}</p>
                  <p>👥 Comunidad COLANT</p>
                </div>

                <button
                  onClick={() => joinEvent(event.id)}
                  className="mt-5 bg-blue-700 text-white w-full py-3 rounded-2xl font-bold shadow-md"
                >
                  {t.join}
                </button>

                {isAdmin && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => loadAttendees(event.id)}
                      className="bg-purple-600 text-white flex-1 py-3 rounded-2xl text-sm font-bold"
                    >
                      {t.attendees}
                    </button>

                    <button
                      onClick={() => loadGallery(event.id)}
                      className="bg-pink-600 text-white flex-1 py-3 rounded-2xl text-sm font-bold"
                    >
                      {t.photos}
                    </button>
                  </div>
                )}

                {isAdmin && attendeesByEvent[event.id] && (
                  <div className="mt-4 bg-purple-50 p-3 rounded-xl">
                    <p className="font-bold text-purple-800 mb-2">
                      👥 {t.attendees}: {attendeesByEvent[event.id].count}
                    </p>

                    {attendeesByEvent[event.id].attendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="bg-white p-3 rounded-xl mb-2 border"
                      >
                        <p className="font-bold text-blue-950">
                          {attendee.full_name}
                        </p>

                        <p className="text-xs text-gray-600">
                          {attendee.email}
                        </p>

                        <p className="text-xs text-gray-600">
                          📍 {attendee.city_origin || t.cityNotRegistered}
                        </p>

                        <p className="text-xs text-gray-600">
                          💼 {attendee.industry || t.industryNotRegistered}
                        </p>

                        <p className="text-xs text-gray-600">
                          🎓 {attendee.visa_type || t.visaNotRegistered}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

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
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Events