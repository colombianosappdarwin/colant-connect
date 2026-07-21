import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import { initializePushNotifications } from "./pushNotifications";

import Register from "./Register";
import Login from "./Login";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

import EventDetail from "./EventDetail";
import EventMap from "./EventMap";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import BottomNavigation from "./components/BottomNavigation";
import { texts } from "./translations";

function App() {
  const [events, setEvents] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Mientras se verifica el token, mostramos la pantalla de carga.
  const [checkingSession, setCheckingSession] = useState(true);

  const [authMode, setAuthMode] = useState("login");
  const [verificationEmail, setVerificationEmail] = useState("");

  const [activeTab, setActiveTab] = useState("home");
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "es"
  );

  const [galleryByEvent, setGalleryByEvent] = useState({});
  const [attendeesByEvent, setAttendeesByEvent] = useState({});

  const t = texts[language];

  const toggleLanguage = () => {
    setLanguage((previousLanguage) => {
      const newLanguage =
        previousLanguage === "es" ? "en" : "es";

      localStorage.setItem("language", newLanguage);

      return newLanguage;
    });
  };

  const whatsappNumber = "+61405376310";

  const whatsappText =
    language === "es"
      ? "Hola COLANT Connect, quiero más información."
      : "Hello COLANT Connect, I would like more information.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  const loadEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/`);

      setEvents(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const loadBusinesses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/businesses/`
      );

      setBusinesses(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Error loading businesses:", error);
    }
  };

  const restoreSession = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCheckingSession(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserProfile(response.data);
      setActiveTab("home");

      // Registra nuevamente el dispositivo para notificaciones.
      try {
        await initializePushNotifications();
      } catch (pushError) {
        console.error(
          "Error initializing push notifications:",
          pushError
        );
      }
    } catch (error) {
      console.error(
        "Stored session is no longer valid:",
        error.response?.data || error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("email");

      setUserProfile(null);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    loadEvents();
    loadBusinesses();
    restoreSession();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    setUserProfile(null);
    setAuthMode("login");
    setActiveTab("home");
    setSelectedEventDetail(null);
  };

  // Pantalla inicial mientras verificamos la sesión guardada.
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-950 px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-400 text-5xl shadow-2xl">
            🇨🇴
          </div>

          <h1 className="text-4xl font-extrabold text-white">
            COLANT
          </h1>

          <p className="mt-2 text-lg font-semibold text-blue-100">
            Colombianos en Australia
          </p>

          <div className="mx-auto mt-8 h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-yellow-400" />

          <p className="mt-4 text-sm text-blue-200">
            {language === "es"
              ? "Cargando tu sesión..."
              : "Loading your session..."}
          </p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    if (window.location.pathname === "/reset-password") {
      return (
        <ResetPassword
          onLoginClick={() => setAuthMode("login")}
        />
      );
    }

    if (authMode === "verifyEmail") {
      return (
        <VerifyEmail
          initialEmail={verificationEmail}
          onLoginClick={() => setAuthMode("login")}
        />
      );
    }

    if (authMode === "register") {
      return (
        <Register
          onLoginClick={() => setAuthMode("login")}
          onRegisterSuccess={(email) => {
            setVerificationEmail(email);
            setAuthMode("verifyEmail");
          }}
        />
      );
    }

    return (
      <Login
        onRegisterClick={() => setAuthMode("register")}
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          setActiveTab("home");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-slate-950">
      <div className="relative min-h-screen w-full max-w-md bg-white pb-24 text-slate-900">
        <div className="px-5 pb-4 pt-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold leading-tight text-blue-950">
                {t.appTitle}
              </h1>

              <h2 className="text-xl font-bold text-blue-900">
                {t.appSubtitle}
              </h2>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="rounded-xl bg-blue-700 px-3 py-1 text-xs font-bold text-white"
              >
                {language === "es"
                  ? "🇺🇸 English"
                  : "🇨🇴 Español"}
              </button>

              <div className="text-3xl">
                🇨🇴🇦🇺
              </div>
            </div>
          </div>

          {activeTab === "eventDetail" &&
            selectedEventDetail && (
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
            <Gallery language={language} />
          )}

          {activeTab === "notifications" && (
            <Notifications
              language={language}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "admin" && (
            <AdminDashboard
              events={events}
              gallery={gallery}
              userProfile={userProfile}
              onEventsUpdated={loadEvents}
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

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-28 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-2xl transition hover:bg-green-600"
        >
          💬{" "}
          {language === "es"
            ? "Contáctanos"
            : "Contact Us"}
        </a>

        <BottomNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
        />
      </div>
    </div>
  );
}

export default App;