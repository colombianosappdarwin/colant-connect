import { useState } from "react"

function Supporters() {
  const [selectedSupporter, setSelectedSupporter] = useState(null)

  const supporters = [
    {
      name: "Northern Territory Government",
      category: "Government Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717850/nt_ffqag4.webp",
      description:
        "We acknowledge the support of the Northern Territory Government through the Community Benefit Fund and the Office of Multicultural Affairs, whose investment helps strengthen multicultural initiatives, community engagement, and cultural celebration in the Northern Territory.",
    },
    {
      name: "Darwin Waterfront",
      category: "Venue Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717850/Waterfront_ovoeu2.webp",
      description:
        "We thank the Darwin Waterfront for investing in and supporting the delivery of Viva Colombia Fest; and for providing an iconic location that allows the community to come together and celebrate culture in the heart of Darwin.",
    },
    {
      name: "Migrant Workers Hub",
      category: "Community Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Migrant_txt0x3.webp",
      description:
        "We thank the MigraNT Workers Hub. A free, confidential support and advocacy service for temporary visa holders in the Northern Territory. Operated by Unions NT, it aims to protect migrant workers from exploitation by providing education on workplace rights, visa conditions, and employer sponsorship obligations. The Hub provides localized, on-the-ground support to help workers navigate the complexities of working in the NT.",
    },
    {
      name: "Darwin Catering Company",
      category: "Food Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Darwin_Caterin_kzfxmh.webp",
      description:
        "Darwin Catering Company is a proudly local, family-owned hospitality business that has been serving the Northern Territory since 2011. Renowned for delivering exceptional catering experiences for events of all sizes, the team combines quality local ingredients, creativity and outstanding service to create memorable food experiences. We are grateful for their support of Viva Colombia Fest 2026 and their contribution to Darwin’s vibrant food and events industry.",
    },
    {
      name: "Sweethearts",
      category: "Official After Party Venue",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258412/sweet_gz2szq.webp",
      description:
        "Sweethearts at The Cinema Collective is Darwin's only duelling piano bar, offering a unique blend of live entertainment, great food and unforgettable nightlife in the heart of the city. Inspired by the legendary Top End crocodile 'Sweetheart', the venue brings people together through live music, local flavours and a vibrant atmosphere seven nights a week. We are thrilled to have Sweethearts as the Official After Party Venue for Viva Colombia Fest 2026, where the celebration of Colombian culture will continue long into the night.",
    },
    {
      name: "Melaleuca Australia",
      category: "Community Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/MELALEUCA_hbnuow.webp",
      description:
        "Melaleuca Australia is a leading Northern Territory not-for-profit organisation dedicated to supporting humanitarian entrants and migrants as they build new lives in Australia. Through settlement, wellbeing, youth and community services, Melaleuca empowers people to thrive, fostering inclusion, belonging and stronger multicultural communities across the Territory. We are proud to partner with Melaleuca Australia in celebrating the diversity that makes the Northern Territory so unique.",
    },
    {
      name: "Dreamedia",
      category: "Production Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Dreamedia_cfbblc.webp",
      description:
        "Dream Media is a leading Northern Territory event production company specialising in professional audio, lighting, staging and audiovisual solutions. Their expertise helps bring major events to life, creating high-quality experiences that engage audiences and deliver unforgettable moments.",
    },
    {
      name: "MasterRemit",
      category: "Business Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258458/MasterRemit_ldcpp3.webp",
      description:
        "MasterRemit is an Australian fintech company making international money transfers fast, secure and affordable. Through its innovative digital platform, MasterRemit helps people stay connected with their loved ones by enabling reliable transfers to families and communities around the world. Built on a commitment to accessibility, trust and financial inclusion, MasterRemit is proud to support multicultural communities across Australia. We are delighted to have MasterRemit supporting Viva Colombia Fest 2026 and helping connect people across borders.",
    },
    {
      name: "NSCON",
      category: "Business Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717850/qt_q_27NSCON_bwguus.webp",
      description:
        "NSCON is a Territory-owned construction company delivering end-to-end design and construct solutions across Darwin and the Top End. With more than 40 years of local experience, NSCON is known for quality workmanship, innovation and reliability. We are proud to have their support for Viva Colombia Fest 2026.",
    },
    {
      name: "Darwin Olympic Sporting Club",
      category: "Sports Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Darwin_Olympic_Sporting_Club_adjxxl.webp",
      description:
        "Darwin Olympic Sporting Club is one of the Northern Territory's most established football clubs, bringing together players and families from diverse cultural backgrounds for more than 50 years. Committed to excellence, inclusion and community development, the club provides opportunities for people of all ages to participate, connect and thrive through sport. We are proud to partner with Darwin Olympic in celebrating community, diversity and the spirit of the Northern Territory.",
    },
    {
      name: "Hanuman Restaurant",
      category: "Food Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717849/Hanuman_yjkfcu.webp",
      description:
        "Hanuman Restaurant is one of Darwin's most iconic dining destinations, renowned for its award-winning Thai, Indian and Nonya cuisine. For decades, Hanuman has been celebrated for its exceptional hospitality, authentic flavours and commitment to bringing people together through outstanding food. We are proud to have Hanuman Restaurant supporting Viva Colombia Fest 2026 and contributing to Darwin's vibrant multicultural food scene.",
    },
    {
      name: "Multicultural Council of the Northern Territory (MCNT)",
      category: "Community Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783259379/Multicultural_Council_of_the_Northern_Territory_stpart.webp",
      description:
        "The Multicultural Council of the Northern Territory (MCNT) is the Territory's peak multicultural organisation, working to build a more inclusive, connected and culturally diverse community. Through advocacy, settlement support, community development and cultural initiatives, MCNT empowers people from all backgrounds to thrive and contribute to the Northern Territory. We are proud to partner with MCNT in celebrating diversity and strengthening our multicultural community through Viva Colombia Fest 2026.",
      website: "https://mcnt.org.au",
    },
    {
      name: "Territory FM",
      category: "Media Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258616/Territory_FM_strnkz.webp",
      description:
        "Territory FM is a leading community radio station in the Northern Territory, dedicated to connecting people through local news, music, entertainment and community stories. With a strong commitment to promoting cultural diversity and community engagement, Territory FM provides a platform that celebrates the voices and experiences of the Territory's multicultural communities. We are proud to have Territory FM as a Media Partner for Viva Colombia Fest 2026, helping share the spirit of Colombian culture across the Northern Territory.",
    },
    {
      name: "A to Z Media",
      category: "Media & Creative Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258623/A_to_Z_Media_a5p1lz.webp",
      description:
        "A to Z Media is a Northern Territory-owned creative agency specialising in branding, graphic design, digital marketing, web development and print solutions. Passionate about helping businesses and organisations tell their stories, A to Z Media combines creativity with strategic thinking to deliver impactful communication and marketing solutions. We are proud to have A to Z Media supporting Viva Colombia Fest 2026 and helping showcase the richness of Colombian culture to the wider community.",
    },
    {
      name: "Top End Maintenance & Removalists",
      category: "Business Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258630/Top_End_Maintenance_Removalists_vanjqj.webp",
      description:
        "Top End Maintenance & Removalists is a trusted Northern Territory business providing professional maintenance, relocation and property services for residential and commercial clients. Known for its reliable service, experienced team and commitment to customer satisfaction, the company proudly supports local communities and businesses across the Territory. We are delighted to have Top End Maintenance & Removalists supporting Viva Colombia Fest 2026 and contributing to the success of this celebration of Colombian culture and multicultural diversity.",
    },
    {
      name: "Alma T Shirts",
      category: "Apparel Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258639/Alma_T_Shirts_indqzy.webp",
      description:
        "Alma T Shirts is a creative apparel brand dedicated to producing high-quality custom clothing and merchandise that celebrates identity, culture and community. Through innovative design, premium craftsmanship and personalised products, Alma T Shirts helps organisations, events and businesses bring their ideas to life. We are proud to have Alma T Shirts supporting Viva Colombia Fest 2026 and helping showcase Colombian culture through creativity and community engagement.",
    },
    {
      name: "Nicole Brown",
      category: "Community Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258654/Nicole_Brown_echies.webp",
      description:
        "Nicole Brown is a passionate community advocate dedicated to supporting multicultural initiatives, cultural inclusion and community development across the Northern Territory. Through her ongoing commitment to bringing people together and supporting local events, Nicole has played an important role in strengthening connections between diverse communities. We are honoured to have Nicole Brown supporting Viva Colombia Fest 2026 and helping celebrate the richness and diversity of Colombian culture.",
    },
    {
      name: "Tequila & Sal",
      category: "Food & Beverage Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783258659/Tequila_Sal_onvnez.webp",
      description:
        "Tequila & Sal is a vibrant dining destination celebrating the rich flavours and traditions of Mexican cuisine. Known for its authentic dishes, handcrafted cocktails and welcoming atmosphere, the restaurant brings people together to enjoy memorable culinary experiences. We are proud to have Tequila & Sal supporting Viva Colombia Fest 2026 and contributing to the celebration of Latin American culture and multicultural diversity in the Northern Territory.",
    },
    {
      name: "SAMAF Consultants",
      category: "Business Partner",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782717850/samaf_jgw1np.webp",
      description:
        "SAMAF Consultants is a migrant-founded accounting and business advisory firm based in Darwin. The company supports international students, migrants, humanitarian entrants and small businesses across Australia through professional accounting, taxation and business services. As a proud supporter of Viva Colombia Fest 2026, SAMAF contributes to strengthening multicultural communities and promoting inclusive growth in the Northern Territory.",
      website: "https://samaf.com.au",
    },
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
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 h-24 flex items-center justify-center active:scale-95 transition"
          >
            <img
              src={supporter.image}
              alt={supporter.name}
              className="max-h-16 max-w-full object-contain"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selectedSupporter && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative max-h-[85vh] overflow-y-auto">
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

            {selectedSupporter.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                {selectedSupporter.category}
              </span>
            )}

            <h3 className="text-2xl font-extrabold text-blue-950 mb-3">
              {selectedSupporter.name}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              {selectedSupporter.description}
            </p>

            {selectedSupporter.website && (
              <a
                href={selectedSupporter.website}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center w-full bg-blue-950 text-white font-bold py-3 rounded-2xl"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Supporters
