import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { addThousandSeparator } from "../../utils/helper";
import {
  LuCar,
  LuUsers,
  LuClipboard,
  LuShoppingCart,
  LuDollarSign,
  LuActivity,
  LuCalendarDays,
  LuCloudSun,
  LuUser,
} from "react-icons/lu";
import InformationCardStats from "../../components/cards/InformationCardStats";
import StatsCardOverview from "../../components/cards/StatsCardOverview";
import DashboardOverviewStats from "../../components/cards/DashboardOverviewStats";
import LastCommandesChart from "../../components/Dashboard/LastCommandesChart";
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import EmptyState from "../../components/alerts/EmptyState";
import {
  formatDashboardDate,
  formatDashboardTime,
  getDynamicWeatherLabel,
} from "../../utils/dashboardMeta";
import { resolveImageUrl } from "../../utils/imageUrl";

const DashboardPage = () => {
  const { data: dashboardData, loading } = useDashboard();
  const safeData = useMemo(() => dashboardData || {}, [dashboardData]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let secondTimer;
    const syncTimer = setTimeout(() => {
      setNow(new Date());
      secondTimer = setInterval(() => {
        setNow(new Date());
      }, 1000);
    }, 1000 - new Date().getMilliseconds());

    return () => {
      clearTimeout(syncTimer);
      clearInterval(secondTimer);
    };
  }, []);

  const currentDate = useMemo(() => formatDashboardDate(now), [now]);
  const currentTime = useMemo(() => formatDashboardTime(now), [now]);
  const weatherLabel = useMemo(() => getDynamicWeatherLabel(now), [now]);

  const getCommandeStatusClass = (status) => {
    if (status === "Confirmée") return "bg-green-500/20 text-green-300";
    if (status === "En attente") return "bg-yellow-500/20 text-yellow-300";
    return "bg-gray-500/20 text-gray-300";
  };

  const getVenteStatusClass = (status) => {
    if (status === "Payée") return "bg-green-500/20 text-green-300";
    if (status === "En attente") return "bg-yellow-500/20 text-yellow-300";
    return "bg-red-500/20 text-red-300";
  };

  const formatAmount = (value) => {
    return `${addThousandSeparator(value || 0)} FCFA`;
  };

  const renderRecentItem = (entry, type) => {
    const isSale = type === "sale";
    const amount = isSale ? entry?.prixVente : entry?.montantTotal;
    const date = isSale ? entry?.dateVente : entry?.dateCommande || entry?.date;
    const status = entry?.statut || "Inconnu";
    const statusClass = isSale
      ? getVenteStatusClass(status)
      : getCommandeStatusClass(status);
    const clientName =
      `${entry?.client?.name || ""} ${entry?.client?.surname || ""}`.trim() ||
      entry?.client?.nomComplet ||
      "Client";
    const carLabel =
      `${entry?.voiture?.marque || ""} ${entry?.voiture?.modelCar || ""}`.trim() ||
      entry?.voiture?.description ||
      "Voiture";

    const avatarUrl = resolveImageUrl(entry?.client?.profileImageUrl);
    const initials = clientName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return (
      <div
        key={entry?._id || `${clientName}-${date || "date"}`}
        className="dashboard-recent-item"
      >
        <div className="dashboard-recent-avatar">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={clientName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials || <LuUser className="text-sm" />}</span>
          )}
        </div>

        <div className="dashboard-recent-content">
          <p className="dashboard-recent-title">{clientName}</p>
          <p className="dashboard-recent-subtitle">{carLabel}</p>
        </div>

        <div className="dashboard-recent-meta">
          <p className="dashboard-recent-amount">{formatAmount(amount)}</p>
          {date ? (
            <p className="dashboard-recent-date">
              {new Date(date).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          ) : null}
          <span className={`dashboard-recent-status ${statusClass}`}>
            {status}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full h-full flex items-center justify-center bg-[#010B18]/70 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="text-slate-100/80 text-lg">
              Chargement des données...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-linear-to-br from-[#031827] via-[#052740] to-[#021624] p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-500/8 px-4 py-3 max-w-xl">
            <h1 className="text-2xl font-semibold bg-linear-to-r from-slate-100 via-cyan-100 to-cyan-300 bg-clip-text text-transparent mb-1">
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-300">
              Apercu global des performances CarsHub
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-120">
            <div className="rounded-lg border border-cyan-300/20 bg-[#06253A]/70 px-4 py-3 text-slate-100">
              <div className="flex items-center gap-2 text-cyan-200">
                <LuCalendarDays className="text-base" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Date
                </span>
              </div>
              <p className="mt-1 text-sm font-medium capitalize text-slate-100">
                {currentDate}
              </p>
              <p className="text-xs text-cyan-100/90">{currentTime}</p>
            </div>

            <div className="rounded-lg border border-cyan-300/20 bg-[#06253A]/70 px-4 py-3 text-slate-100">
              <div className="flex items-center gap-2 text-cyan-200">
                <LuCloudSun className="text-base" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Meteo
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-100">
                {weatherLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InformationCardStats
            icon={<LuUsers className="text-2xl" />}
            label="Total Clients"
            value={addThousandSeparator(safeData?.clients?.total || 0)}
            color="border border-cyan-300/25 bg-cyan-500/12"
            textColor="text-white"
            className="backdrop-blur-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          />

          <InformationCardStats
            icon={<LuCar className="text-2xl" />}
            label="Total Voitures"
            value={addThousandSeparator(safeData?.voitures?.total || 0)}
            color="border border-cyan-300/25 bg-cyan-500/12"
            textColor="text-white"
            className="backdrop-blur-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          />

          <InformationCardStats
            icon={<LuShoppingCart className="text-2xl" />}
            label="Total Ventes"
            value={addThousandSeparator(safeData?.ventes?.total || 0)}
            color="border border-cyan-300/25 bg-cyan-500/12"
            textColor="text-white"
            className="backdrop-blur-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          />

          <InformationCardStats
            icon={<LuClipboard className="text-2xl" />}
            label="Total Commandes"
            value={addThousandSeparator(safeData?.commandes?.total || 0)}
            color="border border-cyan-300/25 bg-cyan-500/12"
            textColor="text-white"
            className="backdrop-blur-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCardOverview
            icon={<LuDollarSign className="text-xl text-white" />}
            label="Revenu Total"
            value={addThousandSeparator(
              safeData?.statistiques?.revenueTotal || 0,
            )}
            color="bg-gradient-to-r from-cyan-500 to-cyan-600"
            textColor="text-white"
            className="bg-[#07314F]/58 backdrop-blur-xl border border-cyan-300/20 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          />

          <StatsCardOverview
            icon={<LuCar className="text-2xl" />}
            label="Voitures Louées"
            value={addThousandSeparator(safeData?.voitures?.loue || 0)}
            color="bg-gradient-to-r from-emerald-500 to-emerald-700"
            textColor="text-white"
            className="bg-[#07314F]/58 backdrop-blur-xl border border-cyan-300/20 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
          />

          <StatsCardOverview
            icon={<LuClipboard className="text-2xl" />}
            label="Ventes (30j)"
            value={addThousandSeparator(
              safeData?.statistiques?.ventes30Jours || 0,
            )}
            color="bg-gradient-to-r from-amber-500 to-orange-600"
            textColor="text-white"
            className="bg-[#07314F]/58 backdrop-blur-xl border border-cyan-300/20 shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
          />

          <StatsCardOverview
            icon={<LuActivity className="text-2xl" />}
            label="Revenu (30j)"
            value={addThousandSeparator(
              safeData?.statistiques?.revenue30Jours || 0,
            )}
            color="bg-gradient-to-r from-violet-500 to-indigo-600"
            textColor="text-white"
            className="bg-[#07314F]/58 backdrop-blur-xl border border-cyan-300/20 shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commandes récentes */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-r from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center">
                <LuClipboard className="text-lg text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">
                Commandes Récentes
              </h3>
            </div>

            {safeData?.commandes?.recentes?.length > 0 ? (
              <div className="dashboard-recent-list">
                {safeData.commandes.recentes
                  .slice(0, 5)
                  .map((commande) => renderRecentItem(commande, "order"))}
              </div>
            ) : (
              <EmptyState
                title="Aucune commande récente"
                message="Les nouvelles commandes s'afficheront ici automatiquement."
              />
            )}
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-r from-teal-500 to-cyan-700 rounded-lg flex items-center justify-center">
                <LuShoppingCart className="text-lg text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">
                Ventes Récentes
              </h3>
            </div>
            {safeData?.ventes?.recentes?.length > 0 ? (
              <div className="dashboard-recent-list">
                {safeData.ventes.recentes
                  .slice(0, 5)
                  .map((vente) => renderRecentItem(vente, "sale"))}
              </div>
            ) : (
              <EmptyState
                title="Aucune vente récente"
                message="Dès qu'une vente est enregistrée, elle apparaîtra ici."
              />
            )}
          </div>

          <DashboardOverviewStats
            totalClients={safeData?.clients?.total || 0}
            totalCars={safeData?.voitures?.total || 0}
            totalOrders={safeData?.commandes?.total || 0}
            totalSales={safeData?.ventes?.total || 0}
          />

          <LastCommandesChart data={safeData?.commandes?.recentes || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
