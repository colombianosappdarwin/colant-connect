import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "./config"
import Register from "./Register"
import Login from "./Login"
import EventDetail from "./EventDetail"
import EventMap from "./EventMap"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Events from "./pages/Events"
import Gallery from "./pages/Gallery"
import AdminDashboard from "./pages/AdminDashboard"
import BottomNavigation from "./components/BottomNavigation"
import { texts } from "./translations"

function App() {
  const HOME_EVENT_ID = "5ada371d-f75f-4b15-9141-d2cf5b2bdd69"

  const [events, setEvents] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [gallery, setGallery] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [authMode, setAuthMode] = useState("login")
  const [activeTab, setActiveTab] = useState("home")
  const [selectedEventDetail, setSelectedEventDetail] = useState(null)
  const [language, setLanguage] = useState("es")

  const [galleryByEvent, setGalleryByEvent] = useState({})
  const [attendeesByEvent, setAttendeesByEvent] = useState({})

  const t = texts[language]

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  useEffect(() => {
    loadEvents()
    loadBusinesses()
    loadHomeGallery()

    const token = localStorage.getItem("token")

    if (token) {
      axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          setUserProfile(response.data)
        })
        .catch((error) => {
          console.log(error)
          localStorage.removeItem("token")
          localStorage.removeItem("email")
        })
    }
  }, [])

  useEffect(() => {
    if (activeTab === "gallery" && events.length > 0) {
      events.forEach((event) => {
        loadGallery(event.id)
      })
    }
  }, [activeTab, events])

  const loadEvents = () => {
    axios.get(`${API_URL}/events/events/`)
      .then((response) => setEvents(response.data))
      .catch((error) => console.log(error))
  }

  const loadBusinesses = () => {
    axios.get(`${API_URL}/businesses/`)
      .then((response) => setBusinesses(response.data))
      .catch((error) => console.log(error))
  }

  const loadHomeGallery = () => {
    axios.get(`${API_URL}/gallery/${HOME_EVENT_ID}`)
      .then((response) => setGallery(response.data))
      .catch((error) => console.log(error))
  }

  const loadGallery = async (eventId) => {
    try {
      const response = await axios.get(
        `${API_URL}/gallery/${eventId}`
      )

      setGalleryByEvent((prev) => ({
        ...prev,
        [eventId]: response.data
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    window.location.reload()
  }

  if (!userProfile) {
    return authMode === "login" ? (
      <Login onRegisterClick={() => setAuthMode("register")} />
    ) : (
      <Register onLoginClick={() => setAuthMode("login")} />
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-white text-slate-900 pb-24">
        <div className="px-5 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-950 leading-tight">
                {t.appTitle}
              </h1>

              <h2 className="text-xl font-bold text-blue-900">
                {t.appSubtitle}
              </h2>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={toggleLanguage}
                className="bg-blue-700 text-white px-3 py-1 rounded-xl text-xs font-bold"
              >
                {language === "es" ? "🇺🇸 English" : "🇨🇴 Español"}
              </button>

              <div className="text-3xl">
                🇨🇴🇦🇺
              </div>
            </div>
          </div>

          {activeTab === "eventDetail" && selectedEventDetail && (
            <EventDetail
              event={selectedEventDetail}
              onBack={() => setActiveTab("home")}
              onViewMap={() => setActiveTab("map")}
              language={language}
            />
          )}

          {activeTab === "map" && (
            <EventMap
              onBack={() => setActiveTab("eventDetail")}
              language={language}
            />
          )}

          {activeTab === "home" && (
            <Home
              events={events}
              gallery={gallery}
              language={language}
              setSelectedEventDetail={setSelectedEventDetail}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "events" && (
            <Events
              events={events}
              setEvents={setEvents}
              businesses={businesses}
              attendeesByEvent={attendeesByEvent}
              setAttendeesByEvent={setAttendeesByEvent}
              galleryByEvent={galleryByEvent}
              setGalleryByEvent={setGalleryByEvent}
              userProfile={userProfile}
              language={language}
            />
          )}

          {activeTab === "gallery" && (
            <Gallery
              events={events}
              galleryByEvent={galleryByEvent}
              loadGallery={loadGallery}
              language={language}
            />
          )}

          {activeTab === "admin" && (
            <AdminDashboard
              events={events}
              businesses={businesses}
              gallery={gallery}
              userProfile={userProfile}
            />
          )}

          {activeTab === "profile" && (
            <Profile
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              logout={logout}
              language={language}
              setActiveTab={setActiveTab}
            />
          )}
        </div>

        <BottomNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
        />
      </div>
    </div>
  )
}

export default App