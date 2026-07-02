import { useState } from "react"
import ImageViewer from "../components/ImageViewer"
import { texts } from "../translations"

const FALLBACK_GALLERY = [
  {
    id: 1,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png",
  },
  {
    id: 2,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png",
  },
  {
    id: 3,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png",
  },
  {
    id: 4,
    image_url:
      "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782313087/colombia-florece_yh0vna.png",
  },
]

function Gallery({
  events = [],
  galleryByEvent = {},
  language = "es",
}) {
  const t = texts[language]
  const [selectedImage, setSelectedImage] = useState(null)

  const fallbackEvent = {
    id: "colombia-florece-2026",
    title: "Colombia Florece",
  }

  const visibleEvents = events.length > 0 ? events : [fallbackEvent]

  return (
    <>
      <h3 className="text-3xl font-extrabold text-blue-950 mb-6">
        {t.gallery || "Galería"}
      </h3>

      {visibleEvents.map((event) => {
        const photos =
          galleryByEvent[event.id] && galleryByEvent[event.id].length > 0
            ? galleryByEvent[event.id]
            : FALLBACK_GALLERY

        return (
          <div key={event.id} className="mb-10">
            <h4 className="text-xl font-bold text-slate-900 mb-4">
              {event.title}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.image_url}
                  alt="Gallery"
                  onClick={() => setSelectedImage(photo.image_url)}
                  className="w-full h-44 object-cover rounded-2xl shadow-md cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          </div>
        )
      })}

      <ImageViewer
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}

export default Gallery