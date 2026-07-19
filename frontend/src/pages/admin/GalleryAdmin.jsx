import { useEffect, useRef, useState } from "react"
import axios from "axios"
import {
  Camera,
  FolderOpen,
  Images,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { API_URL } from "../../config"

const CLOUD_NAME = "dtlmi9fgx"
const UPLOAD_PRESET = "colant_profiles"

function GalleryAdmin() {
  const fileInputRef = useRef(null)

  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState("")
  const [gallery, setGallery] = useState([])

  const [albumTitle, setAlbumTitle] = useState("")
  const [albumDescription, setAlbumDescription] = useState("")

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

  const token = localStorage.getItem("token")

  const selectedAlbumData = albums.find(
    (album) => String(album.id) === String(selectedAlbum)
  )

  const authHeaders = {
    Authorization: `Bearer ${token}`,
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
          "Error cargando los álbumes"
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
          "Error cargando las fotografías"
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

    if (!title) {
      alert("Escribe el nombre del álbum.")
      return
    }

    try {
      setCreatingAlbum(true)

      const response = await axios.post(
        `${API_URL}/gallery/albums`,
        {
          title,
          description,
          cover_image_url: "",
        },
        {
          headers: authHeaders,
        }
      )

      const newAlbum = response.data

      setAlbumTitle("")
      setAlbumDescription("")

      await loadAlbums()

      if (newAlbum?.id) {
        setSelectedAlbum(String(newAlbum.id))
      }

      alert("Álbum creado correctamente")
    } catch (error) {
      console.error("Error creating album:", error)

      alert(
        error?.response?.data?.detail ||
          "Error creando el álbum"
      )
    } finally {
      setCreatingAlbum(false)
    }
  }

  const deleteAlbum = async () => {
    if (!selectedAlbum) return

    const confirmed = window.confirm(
      `¿Quieres eliminar el álbum "${selectedAlbumData?.title || ""}" y todas sus fotografías?`
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

      alert("Álbum eliminado correctamente")
    } catch (error) {
      console.error("Error deleting album:", error)

      alert(
        error?.response?.data?.detail ||
          "Error eliminando el álbum"
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
    if (!selectedAlbum) {
      throw new Error("No hay un álbum seleccionado.")
    }

    const uploadData = new FormData()

    uploadData.append("file", file)
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
          "Cloudinary no devolvió la URL de la imagen."
      )
    }

    return data.secure_url
  }

  const saveImages = async () => {
    if (!selectedAlbum) {
      alert("Selecciona primero un álbum.")
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

      for (
        let index = 0;
        index < selectedFiles.length;
        index += 1
      ) {
        const file = selectedFiles[index]

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
          "Error eliminando la fotografía"
      )
    }
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
          Crea álbumes y publica fotografías directamente
          desde tu teléfono o computador.
        </p>
      </section>

      {/* CREAR ÁLBUM */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
            <Plus size={20} />
            Crear álbum
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Crea una nueva colección para organizar las
            fotografías.
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
              Nombre del álbum
            </label>

            <input
              id="album-title"
              type="text"
              value={albumTitle}
              onChange={(event) =>
                setAlbumTitle(event.target.value)
              }
              placeholder="Ejemplo: Colombia Florece 2026"
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="album-description"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Descripción
            </label>

            <textarea
              id="album-description"
              value={albumDescription}
              onChange={(event) =>
                setAlbumDescription(event.target.value)
              }
              placeholder="Describe brevemente este álbum"
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={
              creatingAlbum || !albumTitle.trim()
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={19} />

            {creatingAlbum
              ? "Creando..."
              : "Crear álbum"}
          </button>
        </form>
      </section>

      {/* SELECCIONAR ÁLBUM */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
            <FolderOpen size={20} />
            Seleccionar álbum
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Selecciona el álbum que quieres administrar.
          </p>
        </div>

        <div className="p-5">
          {loadingAlbums ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="font-bold text-slate-600">
                Cargando álbumes...
              </p>
            </div>
          ) : albums.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <FolderOpen
                size={32}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-bold text-slate-800">
                Todavía no hay álbumes
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Crea tu primer álbum usando el formulario
                anterior.
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
                  Selecciona un álbum
                </option>

                {albums.map((album) => (
                  <option
                    key={album.id}
                    value={album.id}
                  >
                    {album.title} —{" "}
                    {album.photo_count || 0} foto
                    {album.photo_count === 1 ? "" : "s"}
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

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-slate-600">
                        {selectedAlbumData.photo_count || 0}{" "}
                        fotografía
                        {selectedAlbumData.photo_count === 1
                          ? ""
                          : "s"}
                      </p>

                      <button
                        type="button"
                        onClick={deleteAlbum}
                        className="flex items-center gap-1.5 text-sm font-bold text-red-600"
                      >
                        <Trash2 size={17} />
                        Eliminar álbum
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SUBIR FOTOS */}
      {selectedAlbum && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-extrabold text-slate-950">
              Subir fotografías
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Puedes seleccionar varias imágenes al mismo
              tiempo.
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
                      key={`${preview}-${index}`}
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

      {/* FOTOS PUBLICADAS */}
      {selectedAlbum && (
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
                Este álbum todavía no tiene fotografías
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