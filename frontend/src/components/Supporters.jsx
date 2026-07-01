import { useState } from "react"

function Supporters() {
  const [selectedSupporter, setSelectedSupporter] = useState(null)

  const supporters = [
    {
      name: "Darwin Catering Company",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Darwin_Caterin_kzfxmh.webp",
      category: "Catering Partner",
      description: "Darwin Catering Company is a proudly local, family-owned hospitality business that has been serving the Northern Territory since 2011. Renowned for delivering exceptional catering experiences for events of all sizes, the team combines quality local ingredients, creativity and outstanding service to create memorable food experiences. We are grateful for their support of Viva Colombia Fest 2026 and their contribution to Darwin’s vibrant food and events industry."
    },
    {
      name: "Dreamedia",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Dreamedia_cfbblc.webp",
      category: "Media Partner",
      description: "Dream Media is a leading Northern Territory event production company specialising in professional audio, lighting, staging and audiovisual solutions. Their expertise helps bring major events to life, creating high-quality experiences that engage audiences and deliver unforgettable moments. "
    },
    {
      name: "Migrant Workers Hub",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Migrant_txt0x3.webp",
      category: "Community Support",
      description: "We thank the MigraNT Workers Hub. A free, confidential support and advocacy service for temporary visa holders in the Northern Territory. Operated by Unions NT, it aims to protect migrant workers from exploitation by providing education on workplace rights, visa conditions, and employer sponsorship obligations. The Hub provides localized, on-the-ground support to help workers navigate the complexities of working in the NT."
    },
    {
      name: "Mr PRAWN",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782718008/MrPRAWN_oez2rn.webp",
      category: "Food Partner",
      description: "For over 45 years, Mr Prawn has been one of the Northern Territory’s most trusted suppliers of premium seafood, meat and poultry. Founded by Colombian-Australian entrepreneur Alberto Arango, the family-owned business has become a Top End icon, serving restaurants, hotels and communities across the Territory."
    },
    {
      name: "NSCON",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717850/qt_q_27NSCON_bwguus.webp",
      category: "Supporter",
      description: "NSCON is a Territory-owned construction company delivering end-to-end design and construct solutions across Darwin and the Top End. With more than 40 years of local experience, NSCON is known for quality workmanship, innovation and reliability. We are proud to have their support for Viva Colombia Fest 2026."
    },
    {
      name: "Northern Territory Government",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717850/nt_ffqag4.webp",
      category: "Government Partner",
      description:
        "We acknowledge the support of the Northern Territory Government through the Community Benefit Fund and the Office of Multicultural Affairs, whose investment helps strengthen multicultural initiatives, community engagement, and cultural celebration in the Northern Territory."
    },
    {
      name: "Darwin Waterfront",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717850/Waterfront_ovoeu2.webp",
      category: "Venue Partner",
      description: "We thank the Darwin Waterfront for investing in and supporting the delivery of Viva Colombia Fest; and for providing an iconic location that allows the community to come together and celebrate culture in the heart of Darwin."
    }
  ]

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-extrabold text-blue-950 mb-2">
        🤝 Our Supporters & Partners
      </h2>

      <p className="text-gray-500 text-sm mb-5">
        Tap a logo to learn more about each partner.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {supporters.map((supporter) => (
          <button
            key={supporter.name}
            onClick={() => setSelectedSupporter(supporter)}
            className="bg-white rounded-2xl shadow-md border p-4 h-24 flex items-center justify-center active:scale-95 transition"
          >
            <img
              src={supporter.image}
              alt={supporter.name}
              className="max-h-16 max-w-full object-contain"
            />
          </button>
        ))}
      </div>

      {selectedSupporter && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setSelectedSupporter(null)}
              className="absolute top-4 right-4 text-gray-400 text-3xl"
            >
              ×
            </button>

            <div className="bg-gray-50 rounded-2xl p-5 mb-5 flex items-center justify-center">
              <img
                src={selectedSupporter.image}
                alt={selectedSupporter.name}
                className="max-h-24 max-w-full object-contain"
              />
            </div>

            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              {selectedSupporter.category}
            </span>

            <h3 className="text-2xl font-extrabold text-blue-950 mb-3">
              {selectedSupporter.name}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              {selectedSupporter.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Supporters