import { useState } from "react"
import ImageViewer from "../components/ImageViewer"
import { texts } from "../translations"

const FALLBACK_GALLERY = [
  { id: 1, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264454/WhatsApp_Image_2026-06-17_at_9.32.09_PM_v1n8ef.jpg" },
  { id: 2, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264452/rs_w_1280_h_854_10_ykfkjh.webp" },
  { id: 3, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264450/rs_w_1280_h_854_12_jt3ene.webp" },
  { id: 4, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264448/rs_w_1280_h_854_qin44w.webp" },
  { id: 5, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264446/rs_w_1280_h_854_11_moy1nj.webp" },
  { id: 6, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264445/rs_w_1280_h_854_9_fzc9vh.webp" },
  { id: 7, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264443/rs_w_1280_h_854_7_zhhg9b.webp" },
  { id: 8, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264441/rs_w_1280_h_854_6_ztxyxr.webp" },
  { id: 9, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264440/rs_w_1280_h_854_8_d8yftv.webp" },
  { id: 10, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264439/rs_w_1280_h_854_5_iqfxhk.webp" },
  { id: 11, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264436/rs_w_1280_h_854_4_vjjjnu.webp" },
  { id: 12, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264435/rs_w_1280_h_854_1_c0z8b2.webp" },
  { id: 13, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264433/rs_w_1280_h_854_3_sf0kjs.webp" },
  { id: 14, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264427/rs_w_984_h_656_1_jsvh9w.webp" },
  { id: 15, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264426/rs_w_984_h_656_2_m1gdo0.webp" },
  { id: 16, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264422/rs_w_600_h_300_cg_true_zad7ms.webp" },
  { id: 17, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264417/descarga_6_bjxaau.webp" },
  { id: 18, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264416/descarga_9_i1ongc.webp" },
  { id: 19, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264414/descarga_8_sv6ip4.webp" },
  { id: 20, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264412/descarga_7_y5vfpl.webp" },
  { id: 21, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264411/descarga_yvnf1n.webp" },
  { id: 22, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264401/descarga_6_ga4mas.webp" },
  { id: 23, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264378/descarga_5_zygbgu.webp" },
  { id: 24, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264376/descarga_4_zoinc6.webp" },
  { id: 25, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264375/descarga_3_zzl1l2.webp" },
  { id: 26, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264373/descarga_2_yh1uxi.webp" },
  { id: 27, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264372/descarga_1_fovusp.webp" },
  { id: 28, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264355/2._festival_vihw8f.jpg" },
  { id: 29, image_url: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783264352/5._family_i0reyx.webp" },
]

function Gallery({
  events = [],
  galleryByEvent = {},
  language = "es",
}) {
  const t = texts[language]

  const [selectedImages, setSelectedImages] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

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
              {photos.map((photo, index) => (
                <img
                  key={photo.id}
                  src={photo.image_url}
                  alt="Gallery"
                  onClick={() => {
                    setSelectedImages(photos)
                    setSelectedIndex(index)
                  }}
                  className="w-full h-44 object-cover rounded-2xl shadow-md cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          </div>
        )
      })}

      <ImageViewer
        images={selectedImages}
        currentIndex={selectedIndex ?? 0}
        onClose={() => setSelectedIndex(null)}
        onNext={() =>
          setSelectedIndex((prev) =>
            prev === selectedImages.length - 1 ? 0 : prev + 1
          )
        }
        onPrev={() =>
          setSelectedIndex((prev) =>
            prev === 0 ? selectedImages.length - 1 : prev - 1
          )
        }
      />
    </>
  )
}

export default Gallery