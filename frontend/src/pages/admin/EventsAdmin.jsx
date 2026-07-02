import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/eventService";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  event_date: "",
};

function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.log(error);
      alert("Error loading events");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateEvent(editingId, formData);
      } else {
        await createEvent(formData);
      }

      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadEvents();
    } catch (error) {
      console.log(error);
      alert("Error saving event");
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      event_date: event.event_date
        ? event.event_date.slice(0, 16)
        : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = confirm("Delete this event?");

    if (!confirmDelete) return;

    try {
      await deleteEvent(eventId);
      loadEvents();
    } catch (error) {
      console.log(error);
      alert("Error deleting event");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">
            Events
          </h1>

          <p className="text-slate-600 mt-2">
            Create, edit and manage community events.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold"
        >
          {showForm ? "Cancel" : "+ Create Event"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5 mb-6 space-y-3"
        >
          <input
            type="text"
            placeholder="Event title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 border rounded-xl bg-white"
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 border rounded-xl bg-white min-h-28"
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full p-3 border rounded-xl bg-white"
            required
          />

          <input
            type="datetime-local"
            value={formData.event_date}
            onChange={(e) =>
              setFormData({ ...formData, event_date: e.target.value })
            }
            className="w-full p-3 border rounded-xl bg-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
          >
            {editingId ? "Update Event" : "Save Event"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="space-y-4 p-4">
          {events.length === 0 && (
            <p className="text-slate-500 text-sm">
              No events created yet.
            </p>
          )}

          {events.map((event) => (
            <div
              key={event.id}
              className="border border-slate-100 rounded-2xl p-4"
            >
              <h2 className="font-bold text-blue-950 text-lg">
                {event.title}
              </h2>

              <p className="text-sm text-slate-600 mt-1">
                {event.location}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {event.event_date
                  ? new Date(event.event_date).toLocaleString()
                  : "No date"}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventsAdmin;