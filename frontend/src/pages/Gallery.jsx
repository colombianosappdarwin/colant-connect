import { useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Images,
  MapPin,
} from "lucide-react"

import ImageViewer from "../components/ImageViewer"
import { texts } from "../translations"

const FALLBACK_GALLERY = [
  {
    id: 1,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264454/WhatsApp_Image_2026-06-17_at_9.32.09_PM_v1n8ef.jpg",
  },
  {
    id: 2,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264452/rs_w_1280_h_854_10_ykfkjh.webp",
  },
  {
    id: 3,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264450/rs_w_1280_h_854_12_jt3ene.webp",
  },
  {
    id: 4,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264448/rs_w_1280_h_854_qin44w.webp",
  },
  {
    id: 5,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264446/rs_w_1280_h_854_11_moy1nj.webp",
  },
  {
    id: 6,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264445/rs_w_1280_h_854_9_fzc9vh.webp",
  },
  {
    id: 7,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264443/rs_w_1280_h_854_7_zhhg9b.webp",
  },
  {
    id: 8,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264441/rs_w_1280_h_854_6_ztxyxr.webp",
  },
  {
    id: 9,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264440/rs_w_1280_h_854_8_d8yftv.webp",
  },
  {
    id: 10,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264439/rs_w_1280_h_854_5_iqfxhk.webp",
  },
  {
    id: 11,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264436/rs_w_1280_h_854_4_vjjjnu.webp",
  },
  {
    id: 12,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264435/rs_w_1280_h_854_1_c0z8b2.webp",
  },
  {
    id: 13,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264433/rs_w_1280_h_854_3_sf0kjs.webp",
  },
  {
    id: 14,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264427/rs_w_984_h_656_1_jsvh9w.webp",
  },
  {
    id: 15,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264426/rs_w_984_h_656_2_m1gdo0.webp",
  },
  {
    id: 16,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264422/rs_w_600_h_300_cg_true_zad7ms.webp",
  },
  {
    id: 17,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264417/descarga_6_bjxaau.webp",
  },
  {
    id: 18,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264416/descarga_9_i1ongc.webp",
  },
  {
    id: 19,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264414/descarga_8_sv6ip4.webp",
  },
  {
    id: 20,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264412/descarga_7_y5vfpl.webp",
  },
  {
    id: 21,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264411/descarga_yvnf1n.webp",
  },
  {
    id: 22,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264401/descarga_6_ga4mas.webp",
  },
  {
    id: 23,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264378/descarga_5_zygbgu.webp",
  },
  {
    id: 24,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264376/descarga_4_zoinc6.webp",
  },
  {
    id: 25,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264375/descarga_3_zzl1l2.webp",
  },
  {
    id: 26,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264373/descarga_2_yh1uxi.webp",
  },
  {
    id: 27,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264372/descarga_1_fovusp.webp",
  },
  {
    id: 28,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264355/2._festival_vihw8f.jpg",
  },
  {
    id: 29,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264352/5._family_i0reyx.webp",
  },
]

function Gallery({
  events = [],
  galleryByEvent = {},
  language = "es",
}) {
  const t = texts[language]

  const [openedEvent, setOpenedEvent] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  const fallbackEvent = {
    id: "colombia-florece-2026",
    title: "Colombia Florece",
    event_date: "2026-07-11T16:00:00",
    location: "Darwin Waterfront",
  }

  const visibleEvents =
    events.length > 0 ? events : [fallbackEvent]

  const hasRealGallery = Object.values(galleryByEvent).some(
    (photos) => Array.isArray(photos) && photos.length > 0
  )

  const getPhotos = (event, index) => {
    const eventPhotos =
      galleryByEvent[event.id] ||
      galleryByEvent[String(event.id)]

    if (Array.isArray(eventPhotos) && eventPhotos.length > 0) {
      return eventPhotos
    }

    const isColombiaFlorece = event.title
      ?.toLowerCase()
      .includes("colombia florece")

    if (
      !hasRealGallery &&
      (isColombiaFlorece || index === 0)
    ) {
      return FALLBACK_GALLERY
    }

    return []
  }

  const eventsWithPhotos = visibleEvents
    .map((event, index) => ({
      ...event,
      photos: getPhotos(event, index),
    }))
    .filter((event) => event.photos.length > 0)

  const formatDate = (dateValue) => {
    if (!dateValue) return null

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return new Intl.DateTimeFormat(
      language === "es" ? "es-ES" : "en-AU",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(date)
  }

  const openImage = (photos, index) => {
    setSelectedImages(photos)
    setSelectedIndex(index)
  }

  const closeViewer = () => {
    setSelectedIndex(null)
    setSelectedImages([])
  }

  if (openedEvent) {
    return (
      <>
        <div className="pb-28">
          <button
            type="button"
            onClick={() => setOpenedEvent(null)}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ChevronLeft size={19} />

            {language === "es"
              ? "Volver a eventos"
              : "Back to events"}
          </button>

          <div className="mb-6">
            <h3 className="text-3xl font-extrabold text-blue-950">
              {openedEvent.title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
              {openedEvent.event_date && (
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={16} />
                  <span>
                    {formatDate(openedEvent.event_date)}
                  </span>
                </div>
              )}

              {openedEvent.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>{openedEvent.location}</span>
                </div>
              )}
            </div>

            <p className="mt-3 text-sm font-medium text-slate-500">
              {openedEvent.photos.length}{" "}
              {language === "es" ? "fotos" : "photos"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {openedEvent.photos.map((photo, index) => (
              <button
                key={
                  photo.id ??
                  `${openedEvent.id}-${index}`
                }
                type="button"
                onClick={() =>
                  openImage(openedEvent.photos, index)
                }
                className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm"
              >
                <img
                  src={photo.image_url}
                  alt={`${openedEvent.title} ${index + 1}`}
                  loading="lazy"
                  className="h-44 w-full object-cover transition duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>

        {selectedIndex !== null && (
          <ImageViewer
            images={selectedImages}
            currentIndex={selectedIndex}
            onClose={closeViewer}
            onNext={() =>
              setSelectedIndex((previous) =>
                previous === selectedImages.length - 1
                  ? 0
                  : previous + 1
              )
            }
            onPrev={() =>
              setSelectedIndex((previous) =>
                previous === 0
                  ? selectedImages.length - 1
                  : previous - 1
              )
            }
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="pb-28">
        <div className="mb-7">
          <h3 className="text-3xl font-extrabold text-blue-950">
            {t.gallery || "Galería"}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {language === "es"
              ? "Explora nuestras fotografías organizadas por evento."
              : "Explore our photos organised by event."}
          </p>
        </div>

        {eventsWithPhotos.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Images size={26} />
            </div>

            <h4 className="font-bold text-slate-900">
              {language === "es"
                ? "No hay fotos disponibles"
                : "No photos available"}
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              {language === "es"
                ? "Las fotografías aparecerán aquí cuando sean publicadas."
                : "Photos will appear here when they are published."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {eventsWithPhotos.map((event) => {
              const previewPhotos = event.photos.slice(0, 4)

              return (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenedEvent(event)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          event.image_url ||
                          event.photos[0]?.image_url
                        }
                        alt={event.title}
                        loading="lazy"
                        className="h-28 w-28 shrink-0 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1 py-1">
                        <h4 className="line-clamp-2 text-lg font-extrabold text-slate-950">
                          {event.title}
                        </h4>

                        {event.event_date && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <CalendarDays size={15} />

                            <span>
                              {formatDate(event.event_date)}
                            </span>
                          </div>
                        )}

                        {event.location && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <MapPin size={15} />

                            <span className="truncate">
                              {event.location}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-bold text-blue-700">
                            {language === "es"
                              ? `Ver ${event.photos.length} fotos`
                              : `View ${event.photos.length} photos`}
                          </span>

                          <ChevronRight
                            size={20}
                            className="text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {previewPhotos.map((photo, index) => {
                        const isLastPreview =
                          index === 3 &&
                          event.photos.length > 4

                        const remainingPhotos =
                          event.photos.length - 3

                        return (
                          <div
                            key={
                              photo.id ??
                              `${event.id}-preview-${index}`
                            }
                            className="relative overflow-hidden rounded-xl bg-slate-100"
                          >
                            <img
                              src={photo.image_url}
                              alt=""
                              loading="lazy"
                              className="h-20 w-full object-cover"
                            />

                            {isLastPreview && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                                <span className="text-lg font-extrabold text-white">
                                  +{remainingPhotos}
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <ImageViewer
          images={selectedImages}
          currentIndex={selectedIndex}
          onClose={closeViewer}
          onNext={() =>
            setSelectedIndex((previous) =>
              previous === selectedImages.length - 1
                ? 0
                : previous + 1
            )
          }
          onPrev={() =>
            setSelectedIndex((previous) =>
              previous === 0
                ? selectedImages.length - 1
                : previous - 1
            )
          }
        />
      )}
    </>
  )
}

export default Gallery