import EventMap from "./EventMap"
import FestivalAgenda from "./components/FestivalAgenda"
import Supporters from "./components/Supporters"
import { texts } from "./translations"

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png"

const DEFAULT_VIDEO =
  "https://res.cloudinary.com/dtlmi9fgx/video/upload/v1782313263/Viva_Colombia_Fest_2025_Darwin_Waterfront_gcxqqe.mp4"

function EventDetail({ event, language = "es" }) {
  const t = texts[language]

  const title = event?.title || "Colombia Florece"

  const image =
    event?.image_url ||
    DEFAULT_IMAGE

  const description =
    event?.description ||
    t.eventDescription

  const location =
    event?.location ||
    "Darwin Waterfront"

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-5">

          <h1 className="text-4xl font-extrabold text-blue-950 mb-4">
            {title}
          </h1>

          <div className="mb-6 bg-blue-50 rounded-3xl p-4 border border-blue-100">
            <div className="inline-flex items-center bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              🎥 {t.officialPreview}
            </div>

            <video
              controls
              playsInline
              poster={image}
              className="w-full rounded-2xl shadow-lg bg-black"
            >
              <source
                src={DEFAULT_VIDEO}
                type="video/mp4"
              />
            </video>
          </div>

          <div className="grid gap-2 text-gray-700 mb-6">
            <p>📅 Saturday 11 July 2026</p>
            <p>🕓 4 PM - 10 PM</p>
            <p>📍 {location}</p>
            <p>👥 {t.colantCommunity}</p>
          </div>

          <h2 className="text-xl font-bold text-blue-950 mb-2">
            {t.aboutEvent}
          </h2>

          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            {description}
          </p>

          {/* MAPA */}
          <div className="mt-8">
            <EventMap
              compact
              language={language}
            />
          </div>

          {/* AGENDA DEL FESTIVAL */}
          <div className="mt-10">
            <FestivalAgenda />
          </div>

          {/* PATROCINADORES */}
          <div className="mt-10">
            <Supporters />
          </div>

        </div>
      </div>
    </div>
  )
}

export default EventDetail  