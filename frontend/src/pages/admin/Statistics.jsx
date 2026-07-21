import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

import DashboardHeader from "./dashboard/DashboardHeader";
import StatsCards from "./dashboard/StatsCards";

function StatisticsAdmin() {
  const [statistics, setStatistics] = useState({
    total_users: 0,
    total_events: 0,
    total_photos: 0,
    total_notifications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    const loadStatistics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No administrator session was found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/admin/statistics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStatistics({
          total_users:
            response.data.total_users ??
            response.data.registered_users ??
            0,

          total_events:
            response.data.total_events ??
            response.data.events ??
            0,

          total_photos:
            response.data.total_photos ??
            response.data.gallery_photos ??
            0,

          total_notifications:
            response.data.total_notifications ??
            response.data.notifications ??
            0,
        });

        setError("");
      } catch (requestError) {
        console.error(
          "Error loading statistics:",
          requestError.response?.data || requestError
        );

        const backendMessage =
          requestError.response?.data?.detail;

        if (requestError.response?.status === 401) {
          setError(
            backendMessage ||
              "Your session has expired. Please log in again."
          );
        } else if (requestError.response?.status === 403) {
          setError(
            backendMessage ||
              "Only administrators can access these statistics."
          );
        } else if (requestError.response?.status === 404) {
          setError(
            backendMessage ||
              "The statistics endpoint was not found."
          );
        } else {
          setError(
            backendMessage ||
              "The statistics could not be loaded."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const downloadPDF = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No administrator session was found.");
      return;
    }

    try {
      setDownloadingPDF(true);

      const response = await axios.get(
        `${API_URL}/admin/statistics/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const pdfUrl =
        window.URL.createObjectURL(pdfBlob);

      const link =
        document.createElement("a");

      link.href = pdfUrl;
      link.download =
        "colant-connect-complete-report.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(pdfUrl);
    } catch (requestError) {
      console.error(
        "Error downloading PDF:",
        requestError.response?.data || requestError
      );

      if (requestError.response?.status === 401) {
        alert(
          "Your session has expired. Please log in again."
        );
      } else if (requestError.response?.status === 403) {
        alert(
          "Only administrators can download this report."
        );
      } else if (requestError.response?.status === 404) {
        alert(
          "The PDF report is not available yet."
        );
      } else {
        alert(
          "The PDF report could not be generated."
        );
      }
    } finally {
      setDownloadingPDF(false);
    }
  };

  const stats = [
    {
      title: "Registered Users",
      value: statistics.total_users,
      description:
        "Users registered in COLANT Connect.",
    },
    {
      title: "Events",
      value: statistics.total_events,
      description:
        "Events stored in the platform.",
    },
    {
      title: "Gallery Photos",
      value: statistics.total_photos,
      description:
        "Photos stored in the gallery.",
    },
    {
      title: "Notifications",
      value: statistics.total_notifications,
      description:
        "Notifications created in the platform.",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading statistics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-extrabold text-red-700">
          Statistics unavailable
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <StatsCards stats={stats} />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            📄
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Complete Report
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Download a complete PDF report with the
              platform totals and the registered users.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">
            The report includes:
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>✓ Registered users summary</p>
            <p>✓ Full name and email</p>
            <p>✓ Telephone number</p>
            <p>✓ Country and city of origin</p>
            <p>✓ Visa type</p>
            <p>✓ Industry</p>
            <p>✓ Preferred language</p>
            <p>✓ Registration date</p>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadPDF}
          disabled={downloadingPDF}
          className="mt-6 w-full rounded-2xl bg-blue-950 px-5 py-4 font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloadingPDF
            ? "Generating PDF..."
            : "⬇ Download Complete Report (PDF)"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          COLANT Connect administrative report
        </p>
      </section>
    </div>
  );
}

export default StatisticsAdmin;