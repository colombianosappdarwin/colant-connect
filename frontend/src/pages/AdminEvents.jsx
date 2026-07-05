import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminEvents({ token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [image, setImage] = useState(null);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const EVENTS_URL = `${API_URL}/events/`;

  const loadEvents = async () => {
    setLoading(true);

    try {
      const response = await axios.get(EVENTS_URL);
      setEvents(response.data);
    } catch (error) {
      console.log("Error loading events:", error);
      alert("Error loading events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const createEvent = async () => {
    if (!title || !description || !location || !eventDate) {
      alert("Please complete all fields");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("event_date", eventDate);

      if (image) {
        formData.append("image", image);
      }

      await axios.post(EVENTS_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event created successfully");

      setTitle("");
      setDescription("");
      setLocation("");
      setEventDate("");
      setImage(null);

      loadEvents();
    } catch (error) {
      console.log("Error creating event:", error);
      alert("Error creating event");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await axios.delete(`${EVENTS_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event deleted successfully");
      loadEvents();
    } catch (error) {
      console.log("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-5">
      <h2 className="text-2xl font-extrabold text-blue-950 mb-6">
        Manage Events
      </h2>

      <input
        className="w-full border rounded-xl p-3 mb-3"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border rounded-xl p-3 mb-3"
        rows="4"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="w-full border rounded-xl p-3 mb-3"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="datetime-local"
        className="w-full border rounded-xl p-3 mb-3"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        className="w-full border rounded-xl p-3 mb-5"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        onClick={createEvent}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold"
      >
        Create Event
      </button>

      <hr className="my-8" />

      <h3 className="text-xl font-bold text-blue-950 mb-4">
        Existing Events
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events available.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="border rounded-2xl p-4 mb-3"
          >
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
            )}

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">{event.title}</h4>
                <p className="text-gray-600 text-sm">{event.location}</p>
              </div>

              <button
                onClick={() => deleteEvent(event.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminEvents;