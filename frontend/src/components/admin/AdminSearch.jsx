import { Search } from "lucide-react"

function AdminSearch({
  value,
  onChange,
  placeholder = "Search..."
}) {
  return (
    <div className="relative mb-6">

      <Search
        size={20}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-12
          pr-4
          py-4
          rounded-2xl
          border
          border-slate-300
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          text-sm
        "
      />

    </div>
  )
}

export default AdminSearch