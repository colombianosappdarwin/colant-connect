import {
  House,
  CalendarDays,
  Images,
  Bell,
  CircleUser,
} from "lucide-react"

import { texts } from "../translations"

function BottomNavigation({
  activeTab,
  setActiveTab,
  language = "es",
}) {
  const t = texts[language]

  const items = [
    {
      id: "home",
      icon: House,
      label: t.home,
    },
    {
      id: "events",
      icon: CalendarDays,
      label: t.events,
    },
    {
      id: "gallery",
      icon: Images,
      label: t.gallery,
    },
    {
      id: "notifications",
      icon: Bell,
      label: language === "es" ? "Avisos" : "Alerts",
      showBadge: true,
    },
    {
      id: "profile",
      icon: CircleUser,
      label: t.profile,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4 pb-3">
      <div className="grid grid-cols-5 items-center rounded-[28px] border border-slate-100 bg-white px-2 py-3 shadow-2xl">
        {items.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className="flex min-w-0 flex-col items-center justify-center gap-1"
              aria-label={item.label}
            >
              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-700 text-white shadow-lg"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                <Icon size={22} strokeWidth={2.2} />

                {item.showBadge && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                    !
                  </span>
                )}
              </div>

              <span
                className={`max-w-full truncate text-[10px] font-medium ${
                  isActive ? "text-blue-700" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation