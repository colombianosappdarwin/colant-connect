import { useEffect, useState } from "react"
import { texts } from "./translations"

function EventCountdown({ language = "es" }) {
  const t = texts[language]

  const calculateTimeLeft = () => {
    const eventDate = new Date("2026-07-11T16:00:00+09:30")
    const difference = eventDate - new Date()

    if (difference <= 0) {
      return null
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) {
    return (
      <div className="mb-6 bg-green-100 border border-green-200 rounded-3xl p-4 text-center">
        <p className="text-green-800 font-extrabold">
          🎉 {language === "es" ? "¡El evento comenzó!" : "The event has started!"}
        </p>
      </div>
    )
  }

  const items = [
    { label: t.days, value: timeLeft.days },
    { label: t.hours, value: timeLeft.hours },
    { label: t.minutes, value: timeLeft.minutes },
    { label: t.seconds, value: timeLeft.seconds },
  ]

  return (
    <div className="mb-6 rounded-3xl overflow-hidden shadow-lg border border-blue-100">
      <div className="bg-blue-950 text-white px-4 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-yellow-300">
          COLOMBIA FLORECE COUNTDOWN
        </p>

        <h2 className="text-xl font-extrabold mt-1">
          ⏳ {t.eventStartsIn}
        </h2>
      </div>

      <div className="bg-blue-50 p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <div className="bg-white rounded-2xl shadow p-3 border">
                <p className="text-2xl font-extrabold text-blue-950">
                  {item.value}
                </p>
              </div>

              <p className="text-[11px] font-bold text-gray-600 mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventCountdown
