import colombiaFlorece from "../assets/colombia-florece.png";
import EventCountdown from "../EventCountdown";
import AboutColant from "../components/AboutColant";
import { texts } from "../translations";

function Home({
  events,
  language = "es",
  setSelectedEventDetail,
  setActiveTab,
}) {
  const t = texts[language];

  const fallbackEvent = {
    id: "colombia-florece-2026",

    title:
      language === "es"
        ? "Colombia Florece"
        : "Colombia Blooms",

    description:
      language === "es"
        ? "Un evento comunitario que celebra la cultura, gastronomía, música, baile y la unión de los colombianos en Darwin."
        : "A community event celebrating Colombian culture, food, music, dance and connection in Darwin.",

    location: "Darwin Waterfront",

    event_date: "2026-07-11T16:00:00",

    image_url: colombiaFlorece,

    address: "Darwin Waterfront, Darwin NT, Australia",
  };

  const firstEvent =
    events && events.length > 0
      ? events[0]
      : fallbackEvent;

  return (
    <>
      <div className="mt-8 mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">
          {t.upcomingEvents}
        </h3>

        <button
          onClick={() => setActiveTab("events")}
          className="text-sm font-semibold text-blue-700"
        >
          {t.viewAll}
        </button>
      </div>

      <div
        onClick={() => {
          setSelectedEventDetail(firstEvent);
          setActiveTab("eventDetail");
        }}
        className="mb-6 cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-lg transition active:scale-[0.99]"
      >
        <img
          src={firstEvent.image_url || colombiaFlorece}
          alt={firstEvent.title}
          className="h-52 w-full object-cover"
        />

        <div className="p-4">
          <h3 className="text-2xl font-bold text-slate-950">
            {firstEvent.title}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {t.eventDateLine}
          </p>

          <p className="mt-2 text-sm text-gray-700">
            📍 {firstEvent.location}
          </p>

          <p className="mt-2 text-sm text-gray-700">
            👥 {t.colantCommunity}
          </p>

          <div className="mt-4">
            <EventCountdown language={language} />
          </div>

          <div className="mt-4 w-full rounded-xl bg-blue-700 py-3 text-center font-bold text-white">
            {t.viewEventDetails}
          </div>
        </div>
      </div>

      <AboutColant language={language} />
    </>
  );
}

export default Home;