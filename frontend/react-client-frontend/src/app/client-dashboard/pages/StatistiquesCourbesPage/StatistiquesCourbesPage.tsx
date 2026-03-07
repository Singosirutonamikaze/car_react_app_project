import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import useAuth from "../../../../shared/hooks/auth";
import useUser from "../../../../shared/hooks/user";
import { dashboardService } from "../../../../shared/services/dashboard";
import { orderService } from "../../../../shared/services/order";
import type { AchatChartPoint } from "../../../../shared/types/dashboard";
import ROUTES from "../../../../router";

interface Point {
  label: string;
  value: number;
  amount: number;
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
      const directPoints = Array.isArray(response.points) ? response.points : [];

      if (directPoints.length > 0) {
        setTrendPoints(directPoints);
        return;
      }

      // Fallback: dériver les tendances depuis les commandes si l'endpoint charts est vide/inactif.
      const orders = await orderService.getAllOrders();
      const grouped = new Map();

      for (const order of orders) {
        const rawDate = order?.dateCommande;
        const date = rawDate ? new Date(rawDate) : null;
        if (!date || Number.isNaN(date.getTime())) {
          continue;
        }

        const key = date.toISOString().slice(0, 10);
        const existing = grouped.get(key) || { date: key, totalAchats: 0, totalMontant: 0 };
        existing.totalAchats += 1;
        existing.totalMontant += Number(order?.montantTotal ?? order?.montant ?? 0);
        grouped.set(key, existing);
      }

      const derivedPoints = Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date));
      setTrendPoints(derivedPoints);
    };

    void loadTrends();
  }, []);

  const points = useMemo<Point[]>(() => {
    return trendPoints.map((point) => ({
      label: new Date(point.date).toLocaleDateString("fr-FR"),
      value: point.totalAchats,
      amount: Number(point.totalMontant ?? 0),
    }));
  }, [trendPoints]);

  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const maxAmount = Math.max(...points.map((point) => point.amount), 1);
  const valueScaleMax = Math.max(maxValue * 1.2, 1);
  const amountScaleMax = Math.max(maxAmount * 1.2, 1);
  const hasData = points.some((point) => point.value > 0);

  const chartWidth = 900;
  const chartHeight = 320;
  const padding = { top: 24, right: 24, bottom: 56, left: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const barSlot = points.length > 0 ? plotWidth / points.length : plotWidth;
  const barWidth = Math.max(16, Math.min(52, barSlot * 0.56));

  const linePath = points
    .map((point, index) => {
      const x = padding.left + index * barSlot + barSlot / 2;
      const y = padding.top + (1 - point.amount / amountScaleMax) * plotHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

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
          <div className="rounded-lg border client-theme-card-soft p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold client-theme-text-primary">Histogramme + courbe des achats</h3>
              <div className="flex items-center gap-4 text-xs client-theme-text-secondary">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm client-theme-progress" />Nombre d'achats</span>
                <span className="inline-flex items-center gap-2"><span className="h-0.5 w-4 client-theme-chart-line-swatch" />Montant total</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-lg border client-theme-card p-3">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[760px] w-full h-[320px]" aria-label="Histogramme et courbe des achats">
                <line
                  x1={padding.left}
                  y1={padding.top + plotHeight}
                  x2={padding.left + plotWidth}
                  y2={padding.top + plotHeight}
                  className="client-theme-chart-axis"
                  opacity="0.72"
                />

                {points.map((point, index) => {
                  const x = padding.left + index * barSlot + (barSlot - barWidth) / 2;
                  const barHeight = (point.value / valueScaleMax) * plotHeight;
                  const y = padding.top + plotHeight - barHeight;
                  const labelX = padding.left + index * barSlot + barSlot / 2;
                  return (
                    <g key={`bar-${point.label}-${index}`}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(2, barHeight)}
                        rx={4}
                        className="client-theme-chart-bar"
                        opacity="0.86"
                      />
                      <text
                        x={labelX}
                        y={padding.top + plotHeight + 18}
                        textAnchor="middle"
                        fontSize="10"
                        className="client-theme-chart-label"
                        opacity="0.9"
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}

                {linePath ? (
                  <path
                    d={linePath}
                    fill="none"
                    strokeWidth="2.5"
                    className="client-theme-chart-line"
                    opacity="0.96"
                  />
                ) : null}

                {points.map((point, index) => {
                  const x = padding.left + index * barSlot + barSlot / 2;
                  const y = padding.top + (1 - point.amount / amountScaleMax) * plotHeight;
                  return (
                    <circle
                      key={`dot-${point.label}-${index}`}
                      cx={x}
                      cy={y}
                      r={3.2}
                      className="client-theme-chart-dot"
                      opacity="0.96"
                    />
                  );
                })}
              </svg>
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
