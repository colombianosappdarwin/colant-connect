import { useState } from "react"

function FestivalAgenda() {
  const [selectedImage, setSelectedImage] = useState(null)

  const agenda1 =
    "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783317541/1._Agenda_cs4ixk.jpg"

  const agenda2 =
    "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783317536/2._Agenda_g8sibb.jpg"

  const images = [
    { src: agenda1, alt: "Festival Agenda" },
    { src: agenda2, alt: "Complementary Activities" }
  ]

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-extrabold text-blue-950 mb-2">
        🗓️ Festival Agenda
      </h2>

      <p className="text-gray-500 text-sm mb-5">
        Discover the complete program of Viva Colombia Fest 2026.
      </p>

      <div className="space-y-6">
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelectedImage(image)}
            className="w-full block"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full rounded-3xl shadow-lg border cursor-zoom-in"
            />
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 bg-white text-slate-900 w-11 h-11 rounded-full font-extrabold shadow-xl"
          >
            ✕
          </button>

          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default FestivalAgenda