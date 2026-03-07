import { FiBarChart2, FiHeart, FiShoppingCart, FiTruck } from "react-icons/fi";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import useAuth from "../../../../shared/hooks/auth";
import useUser from "../../../../shared/hooks/user";

function StatistiquesPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { enhancedUser, achats, favorites, loading: dashboardLoading } = useUser();
  const displayName = [enhancedUser?.name ?? user?.name ?? "", enhancedUser?.surname ?? user?.surname ?? ""]
    .join(" ")
    .trim();

  const totalAchats = achats?.achats.length ?? 0;
  const totalFavoris = favorites?.favorites.length ?? 0;
  const totalCommandes = enhancedUser?.stats.totalCommandes ?? 0;
  const livrees = enhancedUser?.stats.commandesLivrees ?? 0;

  const chartData = [
    { label: "Achats", value: totalAchats },
    { label: "Favoris", value: totalFavoris },
    { label: "Commandes", value: totalCommandes },
    { label: "Livrees", value: livrees },
  ];
  const hasNoStatsData = chartData.every((item) => item.value === 0);

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  const resolveBarWidthClass = (value: number): string => {
    const ratio = Math.max(value / maxValue, 0.08);

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
  };

  return (
    <AuthenticatedContent isLoading={loading || dashboardLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader
          title="Statistiques"
          subtitle={`Bienvenue, ${displayName}`.trim()}
          icon={FiBarChart2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-lg border client-theme-card-soft p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center client-theme-icon-soft">
                <FiShoppingCart />
              </div>
              <div>
                <p className="client-theme-text-secondary text-sm">Achats</p>
                <p className="client-theme-text-primary text-xl font-semibold">{totalAchats}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border client-theme-card-soft p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center client-theme-icon-soft">
                <FiHeart />
              </div>
              <div>
                <p className="client-theme-text-secondary text-sm">Favoris</p>
                <p className="client-theme-text-primary text-xl font-semibold">{totalFavoris}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border client-theme-card-soft p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center client-theme-icon-soft">
                <FiBarChart2 />
              </div>
              <div>
                <p className="client-theme-text-secondary text-sm">Commandes</p>
                <p className="client-theme-text-primary text-xl font-semibold">{totalCommandes}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border client-theme-card-soft p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center client-theme-icon-soft">
                <FiTruck />
              </div>
              <div>
                <p className="client-theme-text-secondary text-sm">Livrees</p>
                <p className="client-theme-text-primary text-xl font-semibold">{livrees}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border client-theme-card-soft p-5">
          <h3 className="text-base font-semibold client-theme-text-primary mb-4">Evolution des activites</h3>

          {hasNoStatsData ? (
            <EmptyState
              compact
              title="Aucune statistique disponible"
              message="Les courbes apparaitront ici apres vos premieres actions (achats, favoris, commandes)."
            />
          ) : (
            <div className="space-y-3">
              {chartData.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs client-theme-text-secondary mb-1">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 rounded-lg overflow-hidden client-theme-card">
                    <div className={`h-full rounded-lg client-theme-progress ${resolveBarWidthClass(item.value)}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AuthenticatedContent>
  );
}

export default StatistiquesPage;
