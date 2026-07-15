import { useEffect, useState } from "react"
import {
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch"

function ImageViewer({
  images = [],
  currentIndex = 0,
  onClose,
  onNext,
  onPrev,
}) {
  const [touchStart, setTouchStart] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false)

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

  useEffect(() => {
    setTouchStart(null)
    setIsZoomed(false)
  }, [currentIndex])

  if (!image) return null

  const handleTouchStart = (e) => {
    if (isZoomed) return
    if (e.touches.length !== 1) return

    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (isZoomed) {
      setTouchStart(null)
      return
    }

    if (touchStart === null) return
    if (!e.changedTouches[0]) return

    const touchEnd = e.changedTouches[0].clientX
    const difference = touchStart - touchEnd

    if (difference > 50) {
      onNext()
    }

    if (difference < -50) {
      onPrev()
    }

    setTouchStart(null)
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95"
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
        className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-4xl text-white transition hover:bg-black/90"
        aria-label="Close image"
      >
        ×
      </button>

      {!isZoomed && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-3 z-40 text-5xl font-light text-white transition hover:scale-110 md:left-8 md:text-6xl"
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-3 z-40 text-5xl font-light text-white transition hover:scale-110 md:right-8 md:text-6xl"
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <div
        className="h-full w-full"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <TransformWrapper
          key={currentIndex}
          initialScale={1}
          minScale={1}
          maxScale={4}
          centerOnInit
          limitToBounds
          wheel={{ disabled: true }}
          doubleClick={{ disabled: true }}
          pinch={{ disabled: false }}
          panning={{
            disabled: false,
            velocityDisabled: true,
          }}
          onTransformed={(_, state) => {
            setIsZoomed(state.scale > 1.01)
          }}
        >
          <TransformComponent
            wrapperClass="!h-full !w-full"
            contentClass="!h-full !w-full flex items-center justify-center"
          >
            <img
              src={image.image_url}
              alt="Gallery"
              draggable="false"
              className="max-h-[85vh] max-w-[92vw] select-none rounded-2xl object-contain shadow-2xl"
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {!isZoomed && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

export default ImageViewer