function ImageViewer({ image, onClose }) {

  if (!image) return null

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/90
        z-[999]
        flex
        items-center
        justify-center
        p-4
      "
      onClick={onClose}
    >

      <button
        onClick={onClose}
        className="
          absolute
          top-6
          right-6
          text-white
          text-5xl
          font-light
          hover:text-gray-300
          transition
        "
      >
        ×
      </button>

      <img
        src={image}
        alt="Gallery"
        className="
          max-h-[90vh]
          max-w-[95vw]
          rounded-2xl
          shadow-2xl
          object-contain
        "
        onClick={(e) => e.stopPropagation()}
      />

    </div>
  )
}

export default ImageViewer