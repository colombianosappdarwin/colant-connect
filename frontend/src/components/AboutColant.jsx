import AboutCards from "./AboutCards"

function AboutColant() {
  return (
    <section className="mt-8">
      <div className="bg-white rounded-[30px] shadow-xl border border-slate-100 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782721897/image_ww1w3i.png"
          alt="COLANT Community"
          className="w-full h-60 object-cover"
        />

        <div className="p-6">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-700 mb-2">
            ABOUT COLANT
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4">
            Connecting Colombia and Australia in the Northern Territory
          </h2>

          <p className="text-slate-600 leading-7 text-[15px] mb-4">
            COLANT is the leading organisation representing the Colombian community in the Northern Territory, delivering cultural events, community programs, and strategic partnerships that promote inclusion, wellbeing, and opportunity.
          </p>

          <p className="text-slate-600 leading-7 text-[15px]">
            From major festivals to youth, sport, arts and community initiatives, we create spaces where culture, connection, and opportunity come together.
          </p>
        </div>
      </div>

      <AboutCards />
    </section>
  )
}

export default AboutColant