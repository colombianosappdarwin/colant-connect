function AdminStatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-semibold">
            {title}
          </p>

          <h3 className="text-3xl font-extrabold text-blue-950 mt-2">
            {value}
          </h3>
        </div>

        <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default AdminStatCard