import { useEffect, useRef, useState } from "react"
import axios from "axios"
import {
  CalendarDays,
  Camera,
  FolderOpen,
  Images,
  MapPin,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { API_URL } from "../../config"

const CLOUD_NAME = "dtlmi9fgx"
const UPLOAD_PRESET = "colant_profiles"

function GalleryAdmin({ language = "es" }) {
  const fileInputRef = useRef(null)

  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState("")
  const [gallery, setGallery] = useState([])

  const [albumTitle, setAlbumTitle] = useState("")
  const [albumDescription, setAlbumDescription] = useState("")
  const [albumLocation, setAlbumLocation] = useState("")
  const [albumDate, setAlbumDate] = useState("")

  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const [loadingAlbums, setLoadingAlbums] = useState(false)
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [creatingAlbum, setCreatingAlbum] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  })

  const translations = {
    es: {
      dateUnavailable: "Fecha no disponible",
      loadAlbumsError: "Error cargando los álbumes",
      loadPhotosError: "Error cargando las fotografías",
      albumNameRequired: "Escribe el nombre del álbum.",
      albumLocationRequired: "Escribe el lugar del álbum.",
      albumDateRequired: "Selecciona la fecha del álbum.",
      albumCreated: "Álbum creado correctamente",
      albumCreateError: "Error creando el álbum",
      deleteAlbumConfirm: (title) =>
        `¿Quieres eliminar el álbum "${title}" y todas sus fotografías?`,
      albumDeleted: "Álbum eliminado correctamente",
      albumDeleteError: "Error eliminando el álbum",
      imagesOnly: "Solo puedes seleccionar archivos de imagen.",
      noAlbumSelected: "No hay un álbum seleccionado.",
      cloudinaryNoUrl: "Cloudinary no devolvió la URL de la imagen.",
      selectAlbumFirst: "Selecciona primero un álbum.",
      selectPhotos: "Selecciona una o varias fotografías.",
      photosPublished: "Fotografías publicadas correctamente",
      uploadPhotosError: "Error subiendo las fotografías",
      deletePhotoConfirm: "¿Quieres eliminar esta fotografía?",
      deletePhotoError: "Error eliminando la fotografía",
      content: "Contenido",
      gallery: "Galería",
      intro:
        "Crea álbumes y publica fotografías directamente desde tu teléfono o computador.",
      createAlbum: "Crear álbum",
      createAlbumDescription:
        "Crea una nueva colección para organizar las fotografías.",
      albumName: "Nombre del álbum",
      albumNamePlaceholder: "Ejemplo: Colombia Florece 2026",
      description: "Descripción",
      descriptionPlaceholder: "Describe brevemente este álbum",
      place: "Lugar",
      placePlaceholder: "Ejemplo: Darwin Waterfront",
      date: "Fecha",
      creating: "Creando...",
      selectAlbum: "Seleccionar álbum",
      selectAlbumDescription:
        "Selecciona el álbum que quieres administrar.",
      loadingAlbums: "Cargando álbumes...",
      noAlbums: "Todavía no hay álbumes",
      noAlbumsDescription:
        "Crea tu primer álbum usando el formulario anterior.",
      chooseAlbum: "Selecciona un álbum",
      photo: "foto",
      photos: "fotos",
      placeUnavailable: "Lugar no disponible",
      photograph: "fotografía",
      photographs: "fotografías",
      deleteAlbum: "Eliminar álbum",
      uploadPhotos: "Subir fotografías",
      uploadPhotosDescription:
        "Puedes seleccionar varias imágenes al mismo tiempo.",
      selectPhotographs: "Seleccionar fotografías",
      fromPhone: "Desde la cámara o galería del teléfono",
      image: "imagen",
      images: "imágenes",
      selected: "seleccionada",
      selectedPlural: "seleccionadas",
      remove: "Quitar",
      preview: "Vista previa",
      uploadingPhotos: "Subiendo fotografías",
      publishing: "Publicando...",
      publishPhotos: "Publicar fotografías",
      publishedPhotos: "Fotografías publicadas",
      loadingPhotos: "Cargando fotografías...",
      emptyAlbum: "Este álbum todavía no tiene fotografías",
      photoAlt: "Fotografía",
      delete: "Eliminar",
    },
    en: {
      dateUnavailable: "Date unavailable",
      loadAlbumsError: "Error loading albums",
      loadPhotosError: "Error loading photos",
      albumNameRequired: "Enter the album name.",
      albumLocationRequired: "Enter the album location.",
      albumDateRequired: "Select the album date.",
      albumCreated: "Album created successfully",
      albumCreateError: "Error creating the album",
      deleteAlbumConfirm: (title) =>
        `Do you want to delete the album "${title}" and all its photos?`,
      albumDeleted: "Album deleted successfully",
      albumDeleteError: "Error deleting the album",
      imagesOnly: "You can only select image files.",
      noAlbumSelected: "No album is selected.",
      cloudinaryNoUrl: "Cloudinary did not return the image URL.",
      selectAlbumFirst: "Select an album first.",
      selectPhotos: "Select one or more photos.",
      photosPublished: "Photos published successfully",
      uploadPhotosError: "Error uploading photos",
      deletePhotoConfirm: "Do you want to delete this photo?",
      deletePhotoError: "Error deleting the photo",
      content: "Content",
      gallery: "Gallery",
      intro:
        "Create albums and publish photos directly from your phone or computer.",
      createAlbum: "Create album",
      createAlbumDescription:
        "Create a new collection to organise your photos.",
      albumName: "Album name",
      albumNamePlaceholder: "Example: Colombia Florece 2026",
      description: "Description",
      descriptionPlaceholder: "Briefly describe this album",
      place: "Location",
      placePlaceholder: "Example: Darwin Waterfront",
      date: "Date",
      creating: "Creating...",
      selectAlbum: "Select album",
      selectAlbumDescription:
        "Select the album you want to manage.",
      loadingAlbums: "Loading albums...",
      noAlbums: "There are no albums yet",
      noAlbumsDescription:
        "Create your first album using the form above.",
      chooseAlbum: "Select an album",
      photo: "photo",
      photos: "photos",
      placeUnavailable: "Location unavailable",
      photograph: "photo",
      photographs: "photos",
      deleteAlbum: "Delete album",
      uploadPhotos: "Upload photos",
      uploadPhotosDescription:
        "You can select multiple images at the same time.",
      selectPhotographs: "Select photos",
      fromPhone: "From your phone camera or gallery",
      image: "image",
      images: "images",
      selected: "selected",
      selectedPlural: "selected",
      remove: "Remove",
      preview: "Preview",
      uploadingPhotos: "Uploading photos",
      publishing: "Publishing...",
      publishPhotos: "Publish photos",
      publishedPhotos: "Published photos",
      loadingPhotos: "Loading photos...",
      emptyAlbum: "This album does not have any photos yet",
      photoAlt: "Photo",
      delete: "Delete",
    },
  }

  const t = translations[language] || translations.es
  const token = localStorage.getItem("token")

  const selectedAlbumData = albums.find(
    (album) => String(album.id) === String(selectedAlbum)
  )

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return t.dateUnavailable

    const date = new Date(`${dateValue}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
      return t.dateUnavailable
    }

    return new Intl.DateTimeFormat(
      language === "es" ? "es-AU" : "en-AU",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(date)
  }

  const loadAlbums = async () => {
    try {
      setLoadingAlbums(true)

      const response = await axios.get(
        `${API_URL}/gallery/albums`,
        {
          headers: authHeaders,
        }
      )

      setAlbums(
        Array.isArray(response.data)
          ? response.data
          : []
      )
    } catch (error) {
      console.error("Error loading albums:", error)
      setAlbums([])
      alert(
        error?.response?.data?.detail ||
          t.loadAlbumsError
      )
    } finally {
      setLoadingAlbums(false)
    }
  }

  const loadGallery = async (albumId = selectedAlbum) => {
    if (!albumId) {
      setGallery([])
      return
    }

    try {
      setLoadingGallery(true)

      const response = await axios.get(
        `${API_URL}/gallery/albums/${albumId}/photos`,
        {
          headers: authHeaders,
        }
      )

      setGallery(
        Array.isArray(response.data)
          ? response.data
          : []
      )
    } catch (error) {
      console.error("Error loading album photos:", error)
      setGallery([])
      alert(
        error?.response?.data?.detail ||
          t.loadPhotosError
      )
    } finally {
      setLoadingGallery(false)
    }
  }

  useEffect(() => {
    loadAlbums()
  }, [])

  useEffect(() => {
    if (selectedAlbum) {
      loadGallery(selectedAlbum)
    } else {
      setGallery([])
    }

    clearSelectedFiles()
  }, [selectedAlbum])

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview)
      })
    }
  }, [previews])

  const createAlbum = async (event) => {
    event.preventDefault()

    const title = albumTitle.trim()
    const description = albumDescription.trim()
    const location = albumLocation.trim()

    if (!title) {
      alert(t.albumNameRequired)
      return
    }

    if (!location) {
      alert(t.albumLocationRequired)
      return
    }

    if (!albumDate) {
      alert(t.albumDateRequired)
      return
    }

    try {
      setCreatingAlbum(true)

      const response = await axios.post(
        `${API_URL}/gallery/albums`,
        {
          title,
          description,
          location,
          album_date: albumDate,
          cover_image_url: "",
        },
        {
          headers: authHeaders,
        }
      )

      const newAlbum = response.data

      setAlbumTitle("")
      setAlbumDescription("")
      setAlbumLocation("")
      setAlbumDate("")

      await loadAlbums()

      if (newAlbum?.id) {
        setSelectedAlbum(String(newAlbum.id))
      }

      alert(t.albumCreated)
    } catch (error) {
      console.error("Error creating album:", error)
      alert(
        error?.response?.data?.detail ||
          t.albumCreateError
      )
    } finally {
      setCreatingAlbum(false)
    }
  }

  const deleteAlbum = async () => {
    if (!selectedAlbum) return

    const confirmed = window.confirm(
      t.deleteAlbumConfirm(
        selectedAlbumData?.title || ""
      )
    )

    if (!confirmed) return

    try {
      await axios.delete(
        `${API_URL}/gallery/albums/${selectedAlbum}`,
        {
          headers: authHeaders,
        }
      )

      setSelectedAlbum("")
      setGallery([])
      await loadAlbums()
      alert(t.albumDeleted)
    } catch (error) {
      console.error("Error deleting album:", error)
      alert(
        error?.response?.data?.detail ||
          t.albumDeleteError
      )
    }
  }

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
      alert(t.imagesOnly)
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

  const optimizeImage = (file) => {
  return new Promise((resolve, reject) => {
    // Si pesa menos de 9 MB, no hacemos nada
    if (file.size <= 9 * 1024 * 1024) {
      resolve(file)
      return
    }

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")

        const MAX_WIDTH = 2560
        const MAX_HEIGHT = 2560

        let width = img.width
        let height = img.height

        const scale = Math.min(
          1,
          MAX_WIDTH / width,
          MAX_HEIGHT / height
        )

        width = Math.round(width * scale)
        height = Math.round(height * scale)

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl)

            if (!blob) {
              reject(new Error("No se pudo optimizar la imagen."))
              return
            }

            const optimizedFile = new File(
              [blob],
              `${file.name.replace(/\.[^/.]+$/, "")}.jpg`,
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              }
            )

            resolve(optimizedFile)
          },
          "image/jpeg",
          0.85
        )
      } catch (error) {
        URL.revokeObjectURL(objectUrl)
        reject(error)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("No se pudo leer la imagen."))
    }

    img.src = objectUrl
  })
}


const uploadFileToCloudinary = async (file) => {
  if (!selectedAlbum) {
    throw new Error(t.noAlbumSelected)
  }

  const fileToUpload = await optimizeImage(file)

  const uploadData = new FormData()

  uploadData.append("file", fileToUpload)
  uploadData.append("upload_preset", UPLOAD_PRESET)
  uploadData.append(
    "folder",
    `colant/gallery/albums/${selectedAlbum}`
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
        t.cloudinaryNoUrl
    )
  }

  return data.secure_url
}

  const saveImages = async () => {
    if (!selectedAlbum) {
      alert(t.selectAlbumFirst)
      return
    }

    if (selectedFiles.length === 0) {
      alert(t.selectPhotos)
      return
    }

    try {
      setUploading(true)

      setUploadProgress({
        current: 0,
        total: selectedFiles.length,
      })

      let failedUploads = 0

for (
  let index = 0;
  index < selectedFiles.length;
  index += 1
) {
  const file = selectedFiles[index]

  try {
    const imageUrl =
      await uploadFileToCloudinary(file)

    await axios.post(
      `${API_URL}/gallery/albums/${selectedAlbum}/photos`,
      {
        image_url: imageUrl,
      },
      {
        headers: authHeaders,
      }
    )
  } catch (error) {
    failedUploads += 1
    console.error(
      `Error subiendo ${file.name}:`,
      error
    )
  }

  setUploadProgress({
    current: index + 1,
    total: selectedFiles.length,
  })
}

      clearSelectedFiles()

      await Promise.all([
        loadGallery(selectedAlbum),
        loadAlbums(),
      ])

      alert(t.photosPublished)
    } catch (error) {
      console.error("Error uploading gallery:", error)
      alert(
        error?.response?.data?.detail ||
          error?.message ||
          t.uploadPhotosError
      )
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (photoId) => {
    const confirmed = window.confirm(
      t.deletePhotoConfirm
    )

    if (!confirmed) return

    try {
      await axios.delete(
        `${API_URL}/gallery/photos/${photoId}`,
        {
          headers: authHeaders,
        }
      )

      await Promise.all([
        loadGallery(selectedAlbum),
        loadAlbums(),
      ])
    } catch (error) {
      console.error("Error deleting image:", error)
      alert(
        error?.response?.data?.detail ||
          t.deletePhotoError
      )
    }
  }

  const albumPhotoCount =
    selectedAlbumData?.photo_count || 0

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          {t.content}
        </p>

        <h1 className="mt-1 text-3xl font-extrabold text-slate-950">
          {t.gallery}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {t.intro}
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
            <Plus size={20} />
            {t.createAlbum}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t.createAlbumDescription}
          </p>
        </div>

        <form
          onSubmit={createAlbum}
          className="space-y-4 p-5"
        >
          <div>
            <label
              htmlFor="album-title"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              {t.albumName}
            </label>

            <input
              id="album-title"
              type="text"
              value={albumTitle}
              onChange={(event) =>
                setAlbumTitle(event.target.value)
              }
              placeholder={t.albumNamePlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="album-description"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              {t.description}
            </label>

            <textarea
              id="album-description"
              value={albumDescription}
              onChange={(event) =>
                setAlbumDescription(event.target.value)
              }
              placeholder={t.descriptionPlaceholder}
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="album-location"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              {t.place}
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="album-location"
                type="text"
                value={albumLocation}
                onChange={(event) =>
                  setAlbumLocation(event.target.value)
                }
                placeholder={t.placePlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="album-date"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              {t.date}
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="album-date"
                type="date"
                value={albumDate}
                onChange={(event) =>
                  setAlbumDate(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              creatingAlbum ||
              !albumTitle.trim() ||
              !albumLocation.trim() ||
              !albumDate
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={19} />
            {creatingAlbum
              ? t.creating
              : t.createAlbum}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
            <FolderOpen size={20} />
            {t.selectAlbum}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t.selectAlbumDescription}
          </p>
        </div>

        <div className="p-5">
          {loadingAlbums ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="font-bold text-slate-600">
                {t.loadingAlbums}
              </p>
            </div>
          ) : albums.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <FolderOpen
                size={32}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-bold text-slate-800">
                {t.noAlbums}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {t.noAlbumsDescription}
              </p>
            </div>
          ) : (
            <>
              <select
                value={selectedAlbum}
                onChange={(event) =>
                  setSelectedAlbum(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
              >
                <option value="">
                  {t.chooseAlbum}
                </option>

                {albums.map((album) => (
                  <option
                    key={album.id}
                    value={album.id}
                  >
                    {album.title} —{" "}
                    {album.photo_count || 0}{" "}
                    {album.photo_count === 1
                      ? t.photo
                      : t.photos}
                  </option>
                ))}
              </select>

              {selectedAlbumData && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {selectedAlbumData.cover_image_url ? (
                    <img
                      src={
                        selectedAlbumData.cover_image_url
                      }
                      alt={selectedAlbumData.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 w-full items-center justify-center bg-slate-200 text-slate-500">
                      <Images size={38} />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-extrabold text-slate-950">
                      {selectedAlbumData.title}
                    </h3>

                    {selectedAlbumData.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {selectedAlbumData.description}
                      </p>
                    )}

                    <div className="mt-3 space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>
                          {formatDate(
                            selectedAlbumData.album_date
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>
                          {selectedAlbumData.location ||
                            t.placeUnavailable}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-slate-600">
                        {albumPhotoCount}{" "}
                        {albumPhotoCount === 1
                          ? t.photograph
                          : t.photographs}
                      </p>

                      <button
                        type="button"
                        onClick={deleteAlbum}
                        className="flex items-center gap-1.5 text-sm font-bold text-red-600"
                      >
                        <Trash2 size={17} />
                        {t.deleteAlbum}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedAlbum && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-extrabold text-slate-950">
              {t.uploadPhotos}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t.uploadPhotosDescription}
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
                {t.selectPhotographs}
              </span>

              <span className="mt-1 text-sm text-slate-500">
                {t.fromPhone}
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
                    {selectedFiles.length}{" "}
                    {selectedFiles.length === 1
                      ? t.image
                      : t.images}{" "}
                    {selectedFiles.length === 1
                      ? t.selected
                      : t.selectedPlural}
                  </p>

                  <button
                    type="button"
                    onClick={clearSelectedFiles}
                    disabled={uploading}
                    className="flex items-center gap-1 text-sm font-bold text-red-600 disabled:opacity-60"
                  >
                    <X size={16} />
                    {t.remove}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <img
                      key={`${preview}-${index}`}
                      src={preview}
                      alt={`${t.preview} ${index + 1}`}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>{t.uploadingPhotos}</span>

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
                ? t.publishing
                : t.publishPhotos}
            </button>
          </div>
        </section>
      )}

      {selectedAlbum && (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">
                {t.publishedPhotos}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {gallery.length}{" "}
                {gallery.length === 1
                  ? t.photograph
                  : t.photographs}
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
                {t.loadingPhotos}
              </p>
            </div>
          ) : gallery.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <Images
                size={32}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-bold text-slate-800">
                {t.emptyAlbum}
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
                      alt={`${t.photoAlt} ${index + 1}`}
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
                    {t.delete}
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