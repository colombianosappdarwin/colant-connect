import colombiaFlorece from "../assets/colombia-florece.png"
import EventCountdown from "../EventCountdown"
import AboutColant from "../components/AboutColant"
import EventMap from "../EventMap"
import Supporters from "../components/Supporters"
import { texts } from "../translations"

function Home({
  events,
  language = "es",
  setSelectedEventDetail,
  setActiveTab
}) {
  const t = texts[language]

  const fallbackEvent = {
    id: "colombia-florece-2026",
    title: "Colombia Florece",
    description:
      "A community event celebrating Colombian culture, food, music, dance and connection in Darwin.",
    location: "Darwin Waterfront",
    event_date: "2026-07-11T16:00:00",
    image_url: colombiaFlorece,
    address: "Darwin Waterfront, Darwin NT, Australia"
  }

  const firstEvent = events && events.length > 0 ? events[0] : fallbackEvent

  return (
    <>
      <div className="mt-8 flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">
          {t.upcomingEvents}
        </h3>

        <button
          onClick={() => setActiveTab("events")}
          className="text-blue-700 text-sm font-semibold"
        >
          {t.viewAll}
        </button>
      </div>

      <div
        onClick={() => {
          setSelectedEventDetail(firstEvent)
          setActiveTab("eventDetail")
        }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border cursor-pointer active:scale-[0.99] transition"
      >
        <img
          src={firstEvent.image_url || colombiaFlorece}
          alt={firstEvent.title || "Colombia Florece"}
          className="w-full h-52 object-cover"
        />

        <div className="p-4">
          <h3 className="font-bold text-2xl text-slate-950">
            {firstEvent.title || "Colombia Florece"}
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            Saturday 11 July 2026 · 4 PM - 10 PM
          </p>

          <p className="text-sm mt-2 text-gray-700">
            📍 Darwin Waterfront
          </p>

          <p className="text-sm mt-2 text-gray-700">
            👥 {t.colantCommunity}
          </p>

          <div className="mt-4">
            <EventCountdown language={language} />
          </div>

          <div className="mt-4 bg-blue-700 text-white w-full py-3 rounded-xl font-bold text-center">
            {t.viewEventDetails}
          </div>
        </div>
      </div>

      <AboutColant />

      <EventMap />

      <Supporters />
    </>
  )
}

export default Home