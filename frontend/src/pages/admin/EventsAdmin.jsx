import { useState } from "react";

function EventsAdmin() {
  const [events] = useState([
    {
      id: 1,
      title: "Colombia Florece",
      date: "11 July 2026",
      location: "Darwin Waterfront",
      status: "Published",
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">
            Events
          </h1>

          <p className="text-slate-600 mt-2">
            Create, edit and manage community events.
          </p>
        </div>

        <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold">
          + Create Event
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Event</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Status</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-t"
              >
                <td className="p-4 font-semibold">
                  {event.title}
                </td>

                <td className="p-4">
                  {event.date}
                </td>

                <td className="p-4">
                  {event.location}
                </td>

                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {event.status}
                  </span>
                </td>

                <td className="p-4 text-center space-x-2">
                  <button className="bg-yellow-500 text-white px-3 py-2 rounded-lg">
                    Edit
                  </button>

                  <button className="bg-red-600 text-white px-3 py-2 rounded-lg">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventsAdmin;