import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

function GalleryAdmin() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gallery, setGallery] = useState([]);

  const token = localStorage.getItem("token");

  const loadEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGallery = async () => {
    if (!selectedEvent) return;

    try {
      const response = await axios.get(
        `${API_URL}/gallery/${selectedEvent}`
      );

      setGallery(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadGallery();
  }, [selectedEvent]);

  const saveImage = async () => {
    if (!selectedEvent || !imageUrl) {
      alert("Complete all fields");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/gallery`,
        {
          event_id: selectedEvent,
          image_url: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImageUrl("");
      loadGallery();
    } catch (error) {
      console.error(error);
      alert("Error saving image");
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete image?")) return;

    try {
      await axios.delete(`${API_URL}/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadGallery();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-950 mb-6">
        Gallery Admin
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        >
          <option value="">Select Event</option>

          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Cloudinary Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <button
          onClick={saveImage}
          className="bg-blue-700 text-white px-5 py-3 rounded-xl font-bold"
        >
          Save Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <img
              src={photo.image_url}
              alt=""
              className="w-full h-44 object-cover"
            />

            <button
              onClick={() => deleteImage(photo.id)}
              className="w-full bg-red-600 text-white py-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryAdmin;