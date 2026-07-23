import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

import DashboardHeader from "./dashboard/DashboardHeader";
import StatsCards from "./dashboard/StatsCards";

function StatisticsAdmin({ language = "es" }) {
  const [statistics, setStatistics] = useState({
    total_users: 0,
    total_events: 0,
    total_photos: 0,
    total_notifications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const translations = {
    es: {
      noSession: "No se encontró una sesión de administrador.",
      sessionExpired:
        "Tu sesión ha expirado. Inicia sesión nuevamente.",
      onlyAdmins:
        "Solo los administradores pueden acceder a estas estadísticas.",
      endpointNotFound:
        "No se encontró el servicio de estadísticas.",
      loadError:
        "No fue posible cargar las estadísticas.",

      pdfOnlyAdmins:
        "Solo los administradores pueden descargar este reporte.",
      pdfUnavailable:
        "El reporte PDF todavía no está disponible.",
      pdfError:
        "No fue posible generar el reporte PDF.",

      registeredUsers: "Usuarios registrados",
      registeredUsersDescription:
        "Usuarios registrados en COLANT Connect.",

      events: "Eventos",
      eventsDescription:
        "Eventos almacenados en la plataforma.",

      galleryPhotos: "Fotos de la galería",
      galleryPhotosDescription:
        "Fotografías almacenadas en la galería.",

      notifications: "Notificaciones",
      notificationsDescription:
        "Notificaciones creadas en la plataforma.",

      loadingStatistics: "Cargando estadísticas...",
      statisticsUnavailable:
        "Estadísticas no disponibles",

      completeReport: "Reporte completo",
      completeReportDescription:
        "Descarga un reporte PDF completo con los totales de la plataforma y los usuarios registrados.",

      reportIncludes: "El reporte incluye:",
      registeredUsersSummary:
        "✓ Resumen de usuarios registrados",
      fullNameEmail:
        "✓ Nombre completo y correo electrónico",
      telephoneNumber:
        "✓ Número telefónico",
      countryCityOrigin:
        "✓ País y ciudad de origen",
      visaType:
        "✓ Tipo de visa",
      industry:
        "✓ Industria",
      preferredLanguage:
        "✓ Idioma preferido",
      registrationDate:
        "✓ Fecha de registro",

      generatingPDF:
        "Generando PDF...",
      downloadCompleteReport:
        "⬇ Descargar reporte completo (PDF)",
      reportFooter:
        "Reporte administrativo de COLANT Connect",
    },

    en: {
      noSession:
        "No administrator session was found.",
      sessionExpired:
        "Your session has expired. Please log in again.",
      onlyAdmins:
        "Only administrators can access these statistics.",
      endpointNotFound:
        "The statistics endpoint was not found.",
      loadError:
        "The statistics could not be loaded.",

      pdfOnlyAdmins:
        "Only administrators can download this report.",
      pdfUnavailable:
        "The PDF report is not available yet.",
      pdfError:
        "The PDF report could not be generated.",

      registeredUsers:
        "Registered Users",
      registeredUsersDescription:
        "Users registered in COLANT Connect.",

      events:
        "Events",
      eventsDescription:
        "Events stored in the platform.",

      galleryPhotos:
        "Gallery Photos",
      galleryPhotosDescription:
        "Photos stored in the gallery.",

      notifications:
        "Notifications",
      notificationsDescription:
        "Notifications created in the platform.",

      loadingStatistics:
        "Loading statistics...",
      statisticsUnavailable:
        "Statistics unavailable",

      completeReport:
        "Complete Report",
      completeReportDescription:
        "Download a complete PDF report with the platform totals and the registered users.",

      reportIncludes:
        "The report includes:",
      registeredUsersSummary:
        "✓ Registered users summary",
      fullNameEmail:
        "✓ Full name and email",
      telephoneNumber:
        "✓ Telephone number",
      countryCityOrigin:
        "✓ Country and city of origin",
      visaType:
        "✓ Visa type",
      industry:
        "✓ Industry",
      preferredLanguage:
        "✓ Preferred language",
      registrationDate:
        "✓ Registration date",

      generatingPDF:
        "Generating PDF...",
      downloadCompleteReport:
        "⬇ Download Complete Report (PDF)",
      reportFooter:
        "COLANT Connect administrative report",
    },
  };

  const t =
    translations[language] || translations.es;

  useEffect(() => {
    let isMounted = true;

    const loadStatistics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) {
          setError(t.noSession);
          setLoading(false);
        }

        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError("");
        }

        const response = await axios.get(
          `${API_URL}/admin/statistics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!isMounted) {
          return;
        }

        setStatistics({
          total_users:
            response.data?.total_users ??
            response.data?.registered_users ??
            0,

          total_events:
            response.data?.total_events ??
            response.data?.events ??
            0,

          total_photos:
            response.data?.total_photos ??
            response.data?.gallery_photos ??
            0,

          total_notifications:
            response.data?.total_notifications ??
            response.data?.notifications ??
            0,
        });
      } catch (requestError) {
        console.error(
          "Error loading statistics:",
          requestError.response?.data ||
            requestError
        );

        if (!isMounted) {
          return;
        }

        const status =
          requestError.response?.status;

        const backendMessage =
          requestError.response?.data?.detail;

        if (status === 401) {
          setError(
            backendMessage ||
              t.sessionExpired
          );
        } else if (status === 403) {
          setError(
            backendMessage ||
              t.onlyAdmins
          );
        } else if (status === 404) {
          setError(
            backendMessage ||
              t.endpointNotFound
          );
        } else {
          setError(
            backendMessage ||
              t.loadError
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStatistics();

    return () => {
      isMounted = false;
    };
  }, [
    t.endpointNotFound,
    t.loadError,
    t.noSession,
    t.onlyAdmins,
    t.sessionExpired,
  ]);

  const downloadPDF = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.alert(t.noSession);
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
        requestError.response?.data ||
          requestError
      );

      const status =
        requestError.response?.status;

      if (status === 401) {
        window.alert(t.sessionExpired);
      } else if (status === 403) {
        window.alert(t.pdfOnlyAdmins);
      } else if (status === 404) {
        window.alert(t.pdfUnavailable);
      } else {
        window.alert(t.pdfError);
      }
    } finally {
      setDownloadingPDF(false);
    }
  };

  const stats = [
    {
      id: "users",
      title: t.registeredUsers,
      value: statistics.total_users,
      description:
        t.registeredUsersDescription,
    },
    {
      id: "events",
      title: t.events,
      value: statistics.total_events,
      description:
        t.eventsDescription,
    },
    {
      id: "photos",
      title: t.galleryPhotos,
      value: statistics.total_photos,
      description:
        t.galleryPhotosDescription,
    },
    {
      id: "notifications",
      title: t.notifications,
      value:
        statistics.total_notifications,
      description:
        t.notificationsDescription,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950" />

          <p className="mt-4 font-semibold text-slate-600">
            {t.loadingStatistics}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-extrabold text-red-700">
          {t.statisticsUnavailable}
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader language={language} />

      <StatsCards stats={stats} />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            📄
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {t.completeReport}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {t.completeReportDescription}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">
            {t.reportIncludes}
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>{t.registeredUsersSummary}</p>
            <p>{t.fullNameEmail}</p>
            <p>{t.telephoneNumber}</p>
            <p>{t.countryCityOrigin}</p>
            <p>{t.visaType}</p>
            <p>{t.industry}</p>
            <p>{t.preferredLanguage}</p>
            <p>{t.registrationDate}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadPDF}
          disabled={downloadingPDF}
          className="mt-6 w-full rounded-2xl bg-blue-950 px-5 py-4 font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloadingPDF
            ? t.generatingPDF
            : t.downloadCompleteReport}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          {t.reportFooter}
        </p>
      </section>
    </div>
  );
}

export default StatisticsAdmin;