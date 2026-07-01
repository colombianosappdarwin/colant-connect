import {
  House,
  PartyPopper,
  Images,
  UserRound
} from "lucide-react"

function BottomNavigation({ activeTab, setActiveTab, language }) {
  const labels = {
    es: {
      home: "Inicio",
      events: "Festival",
      gallery: "Galería",
      profile: "Perfil"
    },
    en: {
      home: "Home",
      events: "Festival",
      gallery: "Gallery",
      profile: "Profile"
    }
  }

  const t = labels[language] || labels.es

  const items = [
    { id: "home", label: t.home, icon: House },
    { id: "events", label: t.events, icon: PartyPopper },
    { id: "gallery", label: t.gallery, icon: Images },
    { id: "profile", label: t.profile, icon: UserRound }
  ]

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 grid grid-cols-4 py-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-2 transition-all duration-300 active:scale-95"
            >
              <div
                className={
                  isActive
                    ? "bg-blue-700 text-white rounded-2xl p-3 shadow-lg"
                    : "bg-slate-100 text-slate-500 rounded-2xl p-3"
                }
              >
                <Icon size={22} strokeWidth={isActive ? 2.8 : 2} />
              </div>

              <span
                className={
                  isActive
                    ? "text-blue-700 font-bold text-[11px] mt-2"
                    : "text-slate-500 text-[11px] mt-2"
                }
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation