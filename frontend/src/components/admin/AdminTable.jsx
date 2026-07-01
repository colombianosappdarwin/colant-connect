function AdminTable({
  title,
  columns,
  data,
  renderRow
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

      <div className="px-6 py-5 border-b">
        <h2 className="text-2xl font-bold text-blue-950">
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="px-5 py-4 text-left text-sm font-bold text-slate-700"
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.map(renderRow)}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default AdminTable