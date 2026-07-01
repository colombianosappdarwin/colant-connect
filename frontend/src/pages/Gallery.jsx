import { useEffect, useState } from "react"
import ImageViewer from "../components/ImageViewer"
import { texts } from "../translations"

function Gallery({
  events,
  galleryByEvent,
  loadGallery,
  language
}) {
  const t = texts[language]
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (events.length > 0) {
      events.forEach((event) => {
        loadGallery(event.id)
      })
    }
  }, [events])

  return (
    <>
      <h3 className="text-3xl font-extrabold text-blue-950 mb-6">
        {t.gallery}
      </h3>

      {events.map((event) => (
        <div
          key={event.id}
          className="mb-10"
        >
          <h4 className="text-xl font-bold text-slate-900 mb-4">
            {event.title}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {(galleryByEvent[event.id] || []).map((photo) => (
              <img
                key={photo.id}
                src={photo.image_url}
                alt="Gallery"
                onClick={() => setSelectedImage(photo.image_url)}
                className="w-full h-44 object-cover rounded-2xl shadow-md cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>

          {galleryByEvent[event.id] &&
            galleryByEvent[event.id].length === 0 && (
            <p className="text-gray-500 text-sm mt-3">
              No hay fotos disponibles para este evento.
            </p>
          )}
        </div>
      ))}

      <ImageViewer
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}

export default Gallery
