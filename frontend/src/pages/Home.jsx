import colombiaFlorece from "../assets/colombia-florece.png"
import EventCountdown from "../EventCountdown"
import AboutColant from "../components/AboutColant"
import { texts } from "../translations"

function Home({
  events,
  language = "es",
  setSelectedEventDetail,
  setActiveTab
}) {
  const t = texts[language]
  const firstEvent = events[0]

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

      {firstEvent && (
        <div
          onClick={() => {
            setSelectedEventDetail(firstEvent)
            setActiveTab("eventDetail")
          }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border cursor-pointer active:scale-[0.99] transition"
        >
          <img
            src={colombiaFlorece}
            alt="Colombia Florece"
            className="w-full h-52 object-cover"
          />

          <div className="p-4">
            <h3 className="font-bold text-2xl text-slate-950">
              Colombia Florece
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {t.eventDateLine}
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
      )}

      <AboutColant />
    </>
  )
}

export default Home