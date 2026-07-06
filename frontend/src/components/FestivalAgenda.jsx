function FestivalAgenda() {
  const agenda1 =
    "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783317541/1._Agenda_cs4ixk.jpg"

  const agenda2 =
    "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1783317536/2._Agenda_g8sibb.jpg"

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-extrabold text-blue-950 mb-2">
        📅 Festival Agenda
      </h2>

      <p className="text-gray-500 text-sm mb-5">
        Discover the complete program of Viva Colombia Fest 2026.
      </p>

      <div className="space-y-6">
        <img src={agenda1} alt="Festival Agenda" className="w-full rounded-3xl shadow-lg border" />
        <img src={agenda2} alt="Complementary Activities" className="w-full rounded-3xl shadow-lg border" />
      </div>
    </div>
  )
}

export default FestivalAgenda