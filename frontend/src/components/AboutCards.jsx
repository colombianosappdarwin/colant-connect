function AboutCards() {
  const sections = [
    {
      title: "Our Mission",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722537/our_mision_ehd3ot.webp",
      text: "At COLANT, we strive to create a welcoming community that promotes diversity, inclusivity, and respect for all. Our mission is to celebrate and promote the rich cultural heritage of Colombia while strengthening the bonds between our two diverse communities."
    },
    {
      title: "Our History",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722537/our_history_r4gqqe.webp",
      text: "Founded in Darwin on 20 July 2024, during the Independence Day of Colombia celebration, COLANT began as a small group of like-minded individuals who wanted to make a positive impact in their community."
    },
    {
      title: "Our Activities",
      image: "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722545/Our_activities_olykuv.webp",
      text: "We aim to provide a platform for cultural exchange, support, and growth through a variety of initiatives, including cultural and wellbeing events, educational programs, and community outreach."
    }
  ]

  return (
    <div className="mt-6 grid gap-5">
      {sections.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5"
        >
          <div className="flex items-center gap-4 mb-5">
            <img
              src={item.image}
              alt={item.title}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
            />

            <div>
              <h3 className="text-2xl font-extrabold text-blue-950">
                {item.title}
              </h3>

              <p className="text-blue-700 text-sm font-semibold">
                Colombian-Australian Association
              </p>
            </div>
          </div>

          <p className="text-slate-600 text-[15px] leading-7">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  )
}

export default AboutCards