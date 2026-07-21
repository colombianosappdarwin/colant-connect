import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

import DashboardHeader from "./dashboard/DashboardHeader";
import StatsCards from "./dashboard/StatsCards";
import DistributionChart from "./dashboard/DistributionChart";
import GrowthChart from "./dashboard/GrowthChart";

function StatisticsAdmin() {
  const [statistics, setStatistics] = useState({
    total_users: 0,
    total_events: 0,
    total_photos: 0,
    total_notifications: 0,

    users_by_visa: [],
    users_by_country: [],
    users_by_city: [],
    users_by_industry: [],

    user_growth: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

          users_by_visa:
            response.data.users_by_visa ?? [],

          users_by_country:
            response.data.users_by_country ?? [],

          users_by_city:
            response.data.users_by_city ?? [],

          users_by_industry:
            response.data.users_by_industry ?? [],

          user_growth:
            response.data.user_growth ?? [],
        });

      } catch (requestError) {
        console.error(
          "Error loading statistics:",
          requestError.response?.data || requestError
        );

        if (requestError.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (requestError.response?.status === 403) {
          setError("Only administrators can access these statistics.");
        } else {
          setError("The statistics could not be loaded.");
        }

      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const stats = [
    {
      title: "Registered Users",
      value: statistics.total_users,
      description: "Real users registered in COLANT Connect.",
    },
    {
      title: "Events",
      value: statistics.total_events,
      description: "Events currently stored in the platform.",
    },
    {
      title: "Gallery Photos",
      value: statistics.total_photos,
      description: "Photos currently stored in the gallery.",
    },
    {
      title: "Notifications",
      value: statistics.total_notifications,
      description: "Notifications created in COLANT Connect.",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950" />
          <p className="mt-4 font-semibold text-slate-600">
            Loading real statistics...
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

      <GrowthChart
        data={statistics.user_growth}
      />

      <DistributionChart
        title="Users by Visa Type"
        data={statistics.users_by_visa}
        field="visa_type"
      />

      <DistributionChart
        title="Users by Country"
        data={statistics.users_by_country}
        field="country"
      />

      <DistributionChart
        title="Users by City"
        data={statistics.users_by_city}
        field="city"
      />

      <DistributionChart
        title="Users by Industry"
        data={statistics.users_by_industry}
        field="industry"
      />

    </div>
  );
}

export default StatisticsAdmin;