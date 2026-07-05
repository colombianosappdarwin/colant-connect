import { useEffect, useState } from "react"

function ImageViewer({
  images = [],
  currentIndex = 0,
  onClose,
  onNext,
  onPrev,
}) {
  const [touchStart, setTouchStart] = useState(null)

  const image = images[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrev()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, onNext, onPrev])

  if (!image) return null

  const handleTouchEnd = (e) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const difference = touchStart - touchEnd

    if (difference > 50) onNext()
    if (difference < -50) onPrev()

    setTouchStart(null)
  }

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-6 right-6 w-14 h-14 rounded-full bg-black/70 text-white text-4xl flex items-center justify-center hover:bg-black/90 transition z-50"
      >
        ×
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-4 md:left-8 text-white text-5xl md:text-6xl font-light hover:scale-110 transition z-40"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-4 md:right-8 text-white text-5xl md:text-6xl font-light hover:scale-110 transition z-40"
      >
        ›
      </button>

      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={image.image_url}
          alt="Gallery"
          className="max-h-[85vh] max-w-[92vw] rounded-2xl shadow-2xl object-contain"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}

export default ImageViewer