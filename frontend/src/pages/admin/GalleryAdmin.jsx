import { useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import {
  CalendarDays,
  Camera,
  Images,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { API_URL } from "../../config"

const CLOUD_NAME = "dtlmi9fgx"
const UPLOAD_PRESET = "colant_profiles"

function GalleryAdmin() {
  const fileInputRef = useRef(null)

  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [gallery, setGallery] = useState([])

  const [loadingGallery, setLoadingGallery] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  })

  const token = localStorage.getItem("token")

  const sortedEvents = useMemo(() => {
    return [...events].sort((first, second) => {
      const firstDate = first.event_date
        ? new Date(first.event_date).getTime()
        : Number.MAX_SAFE_INTEGER

      const secondDate = second.event_date
        ? new Date(second.event_date).getTime()
        : Number.MAX_SAFE_INTEGER

      return firstDate - secondDate
    })
  }, [events])

  const selectedEventData = events.find(
    (event) => String(event.id) === String(selectedEvent)
  )

  const loadEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setEvents(
        Array.isArray(response.data)
          ? response.data
          : []
      )
    } catch (error) {
      console.error("Error loading events:", error)
      alert("Error cargando los eventos")
    }
  }

  const loadGallery = async () => {
    if (!selectedEvent) {
      setGallery([])
      return
    }

    try {
      setLoadingGallery(true)

      const response = await axios.get(
        `${API_URL}/gallery/${selectedEvent}`
      )

      setGallery(
        Array.isArray(response.data)
          ? response.data
          : []
      )
    } catch (error) {
      console.error("Error loading gallery:", error)
      setGallery([])
      alert("Error cargando las fotografías")
    } finally {
      setLoadingGallery(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    loadGallery()
    clearSelectedFiles()
  }, [selectedEvent])

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview)
      })
    }
  }, [previews])

  const clearSelectedFiles = () => {
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview)
    })

    setSelectedFiles([])
    setPreviews([])
    setUploadProgress({
      current: 0,
      total: 0,
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) return

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    )

    if (validFiles.length !== files.length) {
      alert("Solo puedes seleccionar archivos de imagen.")
    }

    if (validFiles.length === 0) return

    previews.forEach((preview) => {
      URL.revokeObjectURL(preview)
    })

    setSelectedFiles(validFiles)

    setPreviews(
      validFiles.map((file) =>
        URL.createObjectURL(file)
      )
    )
  }

  const uploadFileToCloudinary = async (file) => {
    const uploadData = new FormData()

    uploadData.append("file", file)
    uploadData.append("upload_preset", UPLOAD_PRESET)
    uploadData.append(
      "folder",
      `colant/gallery/${selectedEvent}`
    )

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    )

    const data = await response.json()

    if (!response.ok || !data.secure_url) {
      throw new Error(
        data?.error?.message ||
          "Cloudinary no devolvió la URL de la imagen."
      )
    }

    return data.secure_url
  }

  const saveImages = async () => {
    if (!selectedEvent) {
      alert("Selecciona primero un evento.")
      return
    }

    if (selectedFiles.length === 0) {
      alert("Selecciona una o varias fotografías.")
      return
    }

    try {
      setUploading(true)

      setUploadProgress({
        current: 0,
        total: selectedFiles.length,
      })

      for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index]

        const imageUrl = await uploadFileToCloudinary(file)

        await axios.post(
          `${API_URL}/gallery`,
          {
            event_id: selectedEvent,
            image_url: imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setUploadProgress({
          current: index + 1,
          total: selectedFiles.length,
        })
      }

      clearSelectedFiles()
      await loadGallery()

      alert("Fotografías publicadas correctamente")
    } catch (error) {
      console.error("Error uploading gallery:", error)

      alert(
        error?.response?.data?.detail ||
          error?.message ||
          "Error subiendo las fotografías"
      )
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (photoId) => {
    const confirmed = window.confirm(
      "¿Quieres eliminar esta fotografía?"
    )

    if (!confirmed) return

    try {
      await axios.delete(
        `${API_URL}/gallery/${photoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      await loadGallery()
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Error eliminando la fotografía")
    }
  }

  const formatEventDate = (dateValue) => {
    if (!dateValue) return "Sin fecha"

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return "Sin fecha"
    }

    return new Intl.DateTimeFormat("es-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Contenido
        </p>

        <h1 className="mt-1 text-3xl font-extrabold text-slate-950">
          Galería
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Selecciona un evento y publica sus fotografías
          directamente desde tu teléfono o computador.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-extrabold text-slate-950">
            Seleccionar evento
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Los eventos están organizados por fecha.
          </p>
        </div>

        <div className="p-5">
          <select
            value={selectedEvent}
            onChange={(event) =>
              setSelectedEvent(event.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            <option value="">
              Selecciona un evento
            </option>

            {sortedEvents.map((event) => (
              <option
                key={event.id}
                value={event.id}
              >
                {event.title} —{" "}
                {formatEventDate(event.event_date)}
              </option>
            ))}
          </select>

          {selectedEventData && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              {selectedEventData.image_url ? (
                <img
                  src={selectedEventData.image_url}
                  alt={selectedEventData.title}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                  <CalendarDays size={25} />
                </div>
              )}

              <div className="min-w-0">
                <h3 className="truncate font-extrabold text-slate-950">
                  {selectedEventData.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formatEventDate(
                    selectedEventData.event_date
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {gallery.length} fotografía
                  {gallery.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedEvent && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-extrabold text-slate-950">
              Subir fotografías
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Puedes seleccionar varias imágenes al mismo tiempo.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
              className="flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-slate-400 hover:bg-slate-100 disabled:opacity-60"
            >
              <Camera
                size={32}
                className="text-slate-500"
              />

              <span className="mt-3 font-extrabold text-slate-800">
                Seleccionar fotografías
              </span>

              <span className="mt-1 text-sm text-slate-500">
                Desde la cámara o galería del teléfono
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {previews.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-bold text-slate-800">
                    {selectedFiles.length} imagen
                    {selectedFiles.length === 1
                      ? ""
                      : "es"}{" "}
                    seleccionada
                    {selectedFiles.length === 1
                      ? ""
                      : "s"}
                  </p>

                  <button
                    type="button"
                    onClick={clearSelectedFiles}
                    disabled={uploading}
                    className="flex items-center gap-1 text-sm font-bold text-red-600 disabled:opacity-60"
                  >
                    <X size={16} />
                    Quitar
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <img
                      key={preview}
                      src={preview}
                      alt={`Vista previa ${index + 1}`}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Subiendo fotografías</span>

                  <span>
                    {uploadProgress.current}/
                    {uploadProgress.total}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-slate-950 transition-all"
                    style={{
                      width:
                        uploadProgress.total > 0
                          ? `${
                              (uploadProgress.current /
                                uploadProgress.total) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={saveImages}
              disabled={
                uploading ||
                selectedFiles.length === 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={19} />

              {uploading
                ? "Publicando..."
                : "Publicar fotografías"}
            </button>
          </div>
        </section>
      )}

      {selectedEvent && (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">
                Fotografías publicadas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {gallery.length} fotografía
                {gallery.length === 1 ? "" : "s"}
              </p>
            </div>

            <Images
              size={24}
              className="text-slate-400"
            />
          </div>

          {loadingGallery ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="font-bold text-slate-600">
                Cargando fotografías...
              </p>
            </div>
          ) : gallery.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <Images
                size={32}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-bold text-slate-800">
                Este evento todavía no tiene fotografías
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((photo, index) => (
                <article
                  key={photo.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={photo.image_url}
                      alt={`Fotografía ${index + 1}`}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />

                    <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2.5 py-1 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(photo.id)
                    }
                    className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default GalleryAdmin