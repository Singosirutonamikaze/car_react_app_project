import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import useAuth from "../../../../shared/hooks/auth";
import useUser from "../../../../shared/hooks/user";
import { dashboardService } from "../../../../shared/services/dashboard";
import type { AchatChartPoint } from "../../../../shared/types/dashboard";
import ROUTES from "../../../../router";

interface Point {
  label: string;
  value: number;
}

function resolveBarWidthClass(value: number, maxValue: number): string {
  const ratio = Math.max(value / Math.max(maxValue, 1), 0.08);

  if (ratio >= 0.9) return "w-full";
  if (ratio >= 0.8) return "w-10/12";
  if (ratio >= 0.7) return "w-9/12";
  if (ratio >= 0.6) return "w-8/12";
  if (ratio >= 0.5) return "w-7/12";
  if (ratio >= 0.4) return "w-6/12";
  if (ratio >= 0.3) return "w-5/12";
  if (ratio >= 0.2) return "w-4/12";
  if (ratio >= 0.1) return "w-3/12";

  return "w-2/12";
}

function StatistiquesCourbesPage() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const { enhancedUser, loading: dashboardLoading } = useUser();
  const [trendPoints, setTrendPoints] = useState<AchatChartPoint[]>([]);

  const displayName = [enhancedUser?.name ?? user?.name ?? "", enhancedUser?.surname ?? user?.surname ?? ""]
    .join(" ")
    .trim();

  useEffect(() => {
    const loadTrends = async () => {
      const token = dashboardService.getTokenFromStorage();
      if (!token) {
        setTrendPoints([]);
        return;
      }

      const response = await dashboardService.getUserAchatsChartsByDate(token);
      setTrendPoints(Array.isArray(response.points) ? response.points : []);
    };

    void loadTrends();
  }, []);

  const points = useMemo<Point[]>(() => {
    return trendPoints.map((point) => ({
      label: new Date(point.date).toLocaleDateString("fr-FR"),
      value: point.totalAchats,
    }));
  }, [trendPoints]);

  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const hasData = points.some((point) => point.value > 0);

  return (
    <AuthenticatedContent isLoading={loading || dashboardLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader title="Tendances" subtitle={`Bienvenue, ${displayName}`.trim()} icon={FiBarChart2} />

        <button
          type="button"
          onClick={() => navigate(ROUTES.STATS)}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm client-theme-outline-button"
        >
          <FiArrowLeft />
          Retour aux statistiques
        </button>

        {hasData ? (
          <div className="rounded-lg border client-theme-card-soft p-5">
            <h3 className="text-base font-semibold client-theme-text-primary mb-5">Evolution des achats par date</h3>
            <div className="space-y-4">
              {points.map((point) => {
                return (
                  <div key={point.label}>
                    <div className="flex justify-between text-xs client-theme-text-secondary mb-1">
                      <span>{point.label}</span>
                      <span>{point.value}</span>
                    </div>
                    <div className="h-3 rounded-lg overflow-hidden client-theme-card">
                      <div className={`h-full rounded-lg client-theme-progress ${resolveBarWidthClass(point.value, maxValue)}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Aucune donnee a afficher"
            message="Les tendances s'afficheront ici des que des achats seront enregistres."
          />
        )}
      </section>
    </AuthenticatedContent>
  );
}

export default StatistiquesCourbesPage;
