import { useState } from "react"
import { texts } from "./translations"

const MAIN_MAP_URL =
  "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782316786/maps_hpftw3.png"

const AREA_IMAGES = {
  A: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782435222/AREA_A_xtvqyh.png",
  B: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782435221/AREA_B_sbwftq.png",
  C: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782435439/AREA_C_twhtmp.png",
  D: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782435223/AREA_D_uqvgvp.png",
  E: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782435223/AREA_E_xhoufo.png",
}

function EventMap({ language = "es" }) {
  const [selectedArea, setSelectedArea] = useState(null)
  const t = texts[language]

  const areas = {
    A: {
      title: "Area A - Main Stage",
      subtitle: "Where the Soul Dances",
      emoji: "🎤",
      color: "bg-green-600",
      image: AREA_IMAGES.A,
      events:
        language === "es"
          ? [
              { title: "Presentaciones de folclor tradicional", icon: "💃" },
              { title: "Música en vivo", icon: "🎶" },
              { title: "DJs", icon: "🎧" },
              { title: "Talleres de baile", icon: "🕺" },
            ]
          : [
              { title: "Traditional folklore performances", icon: "💃" },
              { title: "Live music", icon: "🎶" },
              { title: "DJs", icon: "🎧" },
              { title: "Dance workshops", icon: "🕺" },
            ],
    },
    B: {
      title: "Area B - Food Stalls",
      subtitle: "La Cocina del Pueblo",
      emoji: "🍔",
      color: "bg-blue-700",
      image: AREA_IMAGES.B,
      events:
        language === "es"
          ? [
              { title: "Cocina comunitaria colombiana", icon: "🍲" },
              { title: "Negocios de comida latina", icon: "🌮" },
              { title: "Puestos de comida local", icon: "🥘" },
            ]
          : [
              { title: "Colombian Community Kitchen", icon: "🍲" },
              { title: "Latino food businesses", icon: "🌮" },
              { title: "Local food stalls", icon: "🥘" },
            ],
    },
    C: {
      title: "Area C - Family Zone",
      subtitle: "La Plaza del Pueblo",
      emoji: "👨‍👩‍👧",
      color: "bg-gradient-to-br from-yellow-400 to-amber-500",
      image: AREA_IMAGES.C,
      modern: true,
      events:
        language === "es"
          ? [
              { title: "Juegos tradicionales", icon: "🎮" },
              { title: "Actividades para niños", icon: "🎈" },
              { title: "Zona familiar", icon: "⭐" },
              { title: "Integración comunitaria", icon: "🤝" },
            ]
          : [
              { title: "Traditional games", icon: "🎮" },
              { title: "Kids activities", icon: "🎈" },
              { title: "Family zone", icon: "⭐" },
              { title: "Community engagement", icon: "🤝" },
            ],
    },
    D: {
      title: "Area D - Social Engagement Space",
      subtitle: "Colombia in Context",
      emoji: "💜",
      color: "bg-purple-600",
      image: AREA_IMAGES.D,
      events:
        language === "es"
          ? [
              { title: "Raíces, cultura y tradiciones", icon: "🌿" },
              { title: "Justicia y memoria colectiva", icon: "🕊️" },
              { title: "Origami, pintura y talleres", icon: "🎨" },
              { title: "Memoria histórica", icon: "📖" },
            ]
          : [
              { title: "Roots, culture and traditions", icon: "🌿" },
              { title: "Justice and collective memory", icon: "🕊️" },
              { title: "Origami, painting and workshops", icon: "🎨" },
              { title: "Historic memory", icon: "📖" },
            ],
    },
    E: {
      title: "Area E - Cultural Village",
      subtitle: "Raíces y Tradiciones Vivas",
      emoji: "🧡",
      color: "bg-orange-500",
      image: AREA_IMAGES.E,
      events:
        language === "es"
          ? [
              { title: "Región Caribe", icon: "🌊" },
              { title: "Región Pacífica", icon: "🥁" },
              { title: "Región Andina", icon: "⛰️" },
              { title: "Orinoquía", icon: "🐎" },
              { title: "Amazonía", icon: "🌳" },
              { title: "Región Insular", icon: "🏝️" },
            ]
          : [
              { title: "Caribbean region", icon: "🌊" },
              { title: "Pacific region", icon: "🥁" },
              { title: "Andean region", icon: "⛰️" },
              { title: "Orinoco region", icon: "🐎" },
              { title: "Amazon region", icon: "🌳" },
              { title: "Insular region", icon: "🏝️" },
            ],
    },
  }

  const selected = selectedArea ? areas[selectedArea] : null

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-5 pb-3">
          <div className="inline-flex items-center bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            🗺️ {t.interactiveMap}
          </div>

          <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
            {t.festivalAreas}
          </h1>

          <p className="text-sm text-gray-600 mb-4">
            {language === "es"
              ? "Toca una zona directamente sobre el mapa para ver sus eventos."
              : "Tap an area directly on the map to see its events."}
          </p>
        </div>

        <div className="px-5">
          <div className="relative">
            <img
              src={selected ? selected.image : MAIN_MAP_URL}
              alt="Colombia Florece Festival Map"
              className="w-full rounded-2xl border shadow"
            />

            {!selected && (
              <>
                <button
                  onClick={() => setSelectedArea("A")}
                  className="absolute left-[58%] top-[60%] w-[20%] h-[18%] rounded-2xl bg-green-500/20 border-2 border-green-500"
                  aria-label="Area A"
                />

                <button
                  onClick={() => setSelectedArea("B")}
                  className="absolute left-[30%] top-[10%] w-[22%] h-[18%] rounded-2xl bg-blue-500/20 border-2 border-blue-500"
                  aria-label="Area B"
                />

                <button
                  onClick={() => setSelectedArea("C")}
                  className="absolute left-[28%] top-[42%] w-[18%] h-[22%] rounded-2xl bg-yellow-400/20 border-2 border-yellow-400"
                  aria-label="Area C"
                />

                <button
                  onClick={() => setSelectedArea("D")}
                  className="absolute left-[42%] top-[25%] w-[20%] h-[20%] rounded-2xl bg-purple-500/20 border-2 border-purple-500"
                  aria-label="Area D"
                />

                <button
                  onClick={() => setSelectedArea("E")}
                  className="absolute left-[52%] top-[34%] w-[18%] h-[24%] rounded-2xl bg-orange-500/20 border-2 border-orange-500"
                  aria-label="Area E"
                />
              </>
            )}
          </div>
        </div>

        <div className="p-5">
          {selected ? (
            <>
              <button
                onClick={() => setSelectedArea(null)}
                className="mb-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm"
              >
                ← {language === "es" ? "Volver al mapa general" : "Back to main map"}
              </button>

              <div
                className={
                  selected.modern
                    ? "bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-5 border border-indigo-100 shadow-sm"
                    : "bg-blue-50 rounded-3xl p-4 border border-blue-100"
                }
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className={`${selected.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md`}
                  >
                    {selected.emoji}
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-blue-950">
                      {selected.title}
                    </h2>

                    <p
                      className={
                        selected.modern
                          ? "text-sm font-extrabold text-purple-600"
                          : "text-sm font-bold text-gray-600"
                      }
                    >
                      {selected.subtitle}
                    </p>
                  </div>
                </div>

                <h3 className="font-extrabold text-blue-950 mb-4">
                  {language === "es" ? "Eventos en esta zona" : "Events in this area"}
                </h3>

                <div className="grid gap-3">
                  {selected.events.map((item) => (
                    <div
                      key={item.title}
                      className={
                        selected.modern
                          ? "bg-white rounded-2xl p-4 text-sm border border-slate-200 shadow-sm flex items-center justify-between"
                          : "bg-white rounded-xl p-3 text-sm border flex items-center gap-2"
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={
                            selected.modern
                              ? "w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl"
                              : "text-lg"
                          }
                        >
                          {item.icon}
                        </div>

                        <span className="font-bold text-slate-900">
                          {item.title}
                        </span>
                      </div>

                      {selected.modern && (
                        <span className="text-purple-600 text-3xl leading-none">
                          ›
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-green-50 rounded-3xl p-4 border border-green-100">
              <p className="text-sm text-gray-700">
                {language === "es"
                  ? "Selecciona directamente el Área A, B, C, D o E sobre el mapa."
                  : "Select Area A, B, C, D or E directly on the map."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventMap