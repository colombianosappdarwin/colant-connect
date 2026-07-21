Gallery_bilingual_complete.jsx


import { useEffect, useState } from "react"
import axios from "axios"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Images,
  MapPin,
} from "lucide-react"

import ImageViewer from "../components/ImageViewer"
import { API_URL } from "../config"
import { texts } from "../translations"

function Gallery({ language = "es" }) {
  const t = texts[language] || texts.es

  const [albums, setAlbums] = useState([])
  const [openedAlbum, setOpenedAlbum] = useState(null)
  const [albumPhotos, setAlbumPhotos] = useState([])
  const [loadingAlbums, setLoadingAlbums] = useState(true)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [error, setError] = useState("")
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  const loadAlbums = async () => {
    try {
      setLoadingAlbums(true)
      setError("")

      const response = await axios.get(`${API_URL}/gallery/albums`)
      setAlbums(Array.isArray(response.data) ? response.data : [])
    } catch (requestError) {
      console.error("Error loading gallery albums:", requestError)
      setAlbums([])
      setError(
        language === "es"
          ? "No fue posible cargar los álbumes."
          : "Unable to load the albums."
      )
    } finally {
      setLoadingAlbums(false)
    }
  }

  const openAlbum = async (album) => {
    try {
      setOpenedAlbum(album)
      setAlbumPhotos([])
      setLoadingPhotos(true)
      setError("")

      const response = await axios.get(
        `${API_URL}/gallery/albums/${album.id}/photos`
      )

      setAlbumPhotos(Array.isArray(response.data) ? response.data : [])
    } catch (requestError) {
      console.error("Error loading album photos:", requestError)
      setAlbumPhotos([])
      setError(
        language === "es"
          ? "No fue posible cargar las fotografías."
          : "Unable to load the photos."
      )
    } finally {
      setLoadingPhotos(false)
    }
  }

  useEffect(() => {
    loadAlbums()
  }, [])

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return language === "es" ? "Fecha no disponible" : "Date unavailable"
    }

    const date = new Date(`${dateValue}T00:00:00`)

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

  const closeAlbum = () => {
    setOpenedAlbum(null)
    setAlbumPhotos([])
    setError("")
  }

  if (openedAlbum) {
    return (
      <>
        <div className="pb-28">
          <button
            type="button"
            onClick={closeAlbum}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ChevronLeft size={19} />
            {language === "es" ? "Volver a álbumes" : "Back to albums"}
          </button>

          <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {openedAlbum.cover_image_url ? (
              <img
                src={openedAlbum.cover_image_url}
                alt={openedAlbum.title}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center bg-slate-100 text-slate-400">
                <Images size={46} />
              </div>
            )}

            <div className="p-5">
              <h3 className="text-3xl font-extrabold text-blue-950">
                {openedAlbum.title}
              </h3>

              {openedAlbum.description && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {openedAlbum.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={16} />
                  <span>{formatDate(openedAlbum.album_date)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>
                    {openedAlbum.location ||
                      (language === "es"
                        ? "Lugar no disponible"
                        : "Location unavailable")}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm font-bold text-blue-700">
                {albumPhotos.length}{" "}
                {language === "es"
                  ? albumPhotos.length === 1
                    ? "fotografía"
                    : "fotografías"
                  : albumPhotos.length === 1
                    ? "photo"
                    : "photos"}
              </p>
            </div>
          </section>

          {loadingPhotos ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="font-bold text-slate-600">
                {language === "es" ? "Cargando fotografías..." : "Loading photos..."}
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <p className="font-bold text-red-700">{error}</p>
            </div>
          ) : albumPhotos.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <Images size={32} className="mx-auto text-slate-400" />
              <p className="mt-3 font-bold text-slate-800">
                {language === "es"
                  ? "Este álbum todavía no tiene fotografías"
                  : "This album has no photos yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {albumPhotos.map((photo, index) => (
                <button
                  key={photo.id ?? `${openedAlbum.id}-${index}`}
                  type="button"
                  onClick={() => openImage(albumPhotos, index)}
                  className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm"
                >
                  <img
                    src={photo.image_url}
                    alt={`${openedAlbum.title} ${index + 1}`}
                    loading="lazy"
                    className="h-44 w-full object-cover transition duration-300 hover:scale-105"
                  />
                </button>
              ))}
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
                previous === selectedImages.length - 1 ? 0 : previous + 1
              )
            }
            onPrev={() =>
              setSelectedIndex((previous) =>
                previous === 0 ? selectedImages.length - 1 : previous - 1
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
              ? "Explora nuestras fotografías organizadas por álbum."
              : "Explore our photos organised by album."}
          </p>
        </div>

        {loadingAlbums ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-bold text-slate-600">
              {language === "es" ? "Cargando álbumes..." : "Loading albums..."}
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="font-bold text-red-700">{error}</p>
            <button
              type="button"
              onClick={loadAlbums}
              className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white"
            >
              {language === "es" ? "Intentar nuevamente" : "Try again"}
            </button>
          </div>
        ) : albums.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Images size={26} />
            </div>
            <h4 className="font-bold text-slate-900">
              {language === "es" ? "No hay álbumes disponibles" : "No albums available"}
            </h4>
          </div>
        ) : (
          <div className="space-y-5">
            {albums.map((album) => (
              <article
                key={album.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => openAlbum(album)}
                  className="w-full text-left"
                >
                  {album.cover_image_url ? (
                    <img
                      src={album.cover_image_url}
                      alt={album.title}
                      loading="lazy"
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-slate-100 text-slate-400">
                      <Images size={42} />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xl font-extrabold text-slate-950">
                          {album.title}
                        </h4>

                        {album.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {album.description}
                          </p>
                        )}

                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            <span>{formatDate(album.album_date)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span className="truncate">
                              {album.location ||
                                (language === "es"
                                  ? "Lugar no disponible"
                                  : "Location unavailable")}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-sm font-bold text-blue-700">
                          {language === "es"
                            ? `Ver ${album.photo_count || 0} ${
                                (album.photo_count || 0) === 1
                                  ? "foto"
                                  : "fotos"
                              }`
                            : `View ${album.photo_count || 0} ${
                                (album.photo_count || 0) === 1
                                  ? "photo"
                                  : "photos"
                              }`}
                        </p>
                      </div>

                      <ChevronRight size={22} className="mt-1 shrink-0 text-slate-400" />
                    </div>
                  </div>
                </button>
              </article>
            ))}
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
              previous === selectedImages.length - 1 ? 0 : previous + 1
            )
          }
          onPrev={() =>
            setSelectedIndex((previous) =>
              previous === 0 ? selectedImages.length - 1 : previous - 1
            )
          }
        />
      )}
    </>
  )
}

export default Gallery