import { useState } from "react";

function NotificationsAdmin() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const notifications = [
    {
      id: 1,
      title: "Colombia Florece",
      message: "Remember! The festival starts at 4:00 PM.",
      date: "11 Jul 2026",
      status: "Sent",
    },
    {
      id: 2,
      title: "Community Update",
      message: "New photos have been added to the gallery.",
      date: "10 Jul 2026",
      status: "Sent",
    },
  ];

  const handleSend = () => {
    if (!title || !message) {
      alert("Please complete all fields.");
      return;
    }

    alert("Notification ready to be connected with the backend.");

    setTitle("");
    setMessage("");
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
        Notifications
      </h1>

      <p className="text-slate-600 mb-6">
        Send announcements and important information to the community.
      </p>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-950 mb-4">
          Create Notification
        </h2>

        <input
          type="text"
          placeholder="Notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <textarea
          rows="4"
          placeholder="Write your notification..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <button
          onClick={handleSend}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl w-full"
        >
          Send Notification
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-blue-950 mb-4">
          Notification History
        </h2>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border rounded-2xl p-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-blue-950">
                  {notification.title}
                </h3>

                <span className="text-green-600 font-bold text-sm">
                  {notification.status}
                </span>
              </div>

              <p className="text-slate-600 mt-2">
                {notification.message}
              </p>

              <p className="text-xs text-slate-400 mt-3">
                {notification.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationsAdmin;