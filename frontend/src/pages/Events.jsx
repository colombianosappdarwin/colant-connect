import { texts } from "../translations"

const FESTIVAL_IMAGE =
  "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png"

function Events({
  events = [],
  businesses = [],
  userProfile,
  language = "es",
}) {
  const t = texts[language]

  const fallbackEvents = [
    {
      id: "colombia-florece-2026",
      title: "Colombia Florece",
      description:
        "A cultural festival celebrating Colombian food, music, dance, community and connection in Darwin.",
      location: "Darwin Waterfront",
      image_url: FESTIVAL_IMAGE,
    },
  ]

  const visibleEvents = events.length > 0 ? events : fallbackEvents

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

                <div className="mt-5 bg-blue-700 text-white w-full py-3 rounded-2xl font-bold shadow-md text-center">
                  Event Details
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