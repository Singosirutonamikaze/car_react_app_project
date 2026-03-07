import {
  FiAlertOctagon,
  FiShoppingCart,
  FiHeart,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiUser,
  FiMail,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";

import ClientLayout from "../../../../shared/components/layouts/ClientLayout";
import Loading from "../../../../shared/components/ui/Loading";
import useAuth from "../../../../shared/hooks/auth";
import useUser from "../../../../shared/hooks/user";
import type { AchatInfo, CommandeInfo, FavoriInfo } from "../../../../shared/types/dashboard";
import ActivityItem from "../../components/ActivityItem";
import EmptyState from "../../components/EmptyState";
import StatCard from "../../components/StatCard";

interface DashboardActivity {
  type: "achat" | "commande" | "favori";
  title: string;
  date: string;
  amount?: number;
}

function formatDate(dateString?: string): string {
  if (!dateString) {
    return "N/A";
  }

  try {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Date invalide";
  }
}

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} FCFA`;
  }
}

function getBarWidthClass(value: number, maxValue: number): string {
  const ratio = maxValue > 0 ? value / maxValue : 0;

  if (ratio >= 0.95) return "w-full";
  if (ratio >= 0.8) return "w-5/6";
  if (ratio >= 0.65) return "w-2/3";
  if (ratio >= 0.5) return "w-1/2";
  if (ratio >= 0.35) return "w-1/3";
  if (ratio >= 0.2) return "w-1/4";
  return "w-1/6";
}

function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { enhancedUser, achats, loading: dashboardLoading, error, refreshData } = useUser();

  const dataLoading = authLoading || dashboardLoading;
  const recentAchats = achats?.achats || [];

  const getActivityIcon = (type: DashboardActivity["type"]) => {
    switch (type) {
      case "achat":
        return <FiShoppingCart className="text-green-500" />;
      case "favori":
        return <FiHeart className="text-red-500" />;
      case "commande":
        return <FaCar className="client-theme-accent-text" />;
      default:
        return <FiClock className="client-theme-accent-text" />;
    }
  };

  const getRecentActivity = (): DashboardActivity[] => {
    const activities: DashboardActivity[] = [];

    recentAchats.slice(0, 3).forEach((achat: AchatInfo) => {
      if (achat.voiture) {
        activities.push({
          type: "achat",
          title: `${achat.voiture.marque || "Voiture"} ${achat.voiture.modele || ""} (${achat.voiture.annee || ""})`.trim(),
          date: achat.dateAchat,
          amount: achat.prixAchat,
        });
      }
    });

    enhancedUser?.recentCommandes.slice(0, 2).forEach((commande: CommandeInfo) => {
      if (commande.voiture) {
        activities.push({
          type: "commande",
          title: `Commande - ${commande.voiture.marque || "Voiture"} ${commande.voiture.modele || ""}`.trim(),
          date: commande.dateCommande,
          amount: commande.montantTotal,
        });
      }
    });

    enhancedUser?.recentFavorites.slice(0, 2).forEach((favori: FavoriInfo) => {
      if (favori.voiture) {
        activities.push({
          type: "favori",
          title: `${favori.voiture.marque || "Voiture"} ${favori.voiture.modele || ""} ajoute aux favoris`.trim(),
          date: favori.dateAjout,
        });
      }
    });

    return activities
      .filter((activity) => activity.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  if (dataLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center w-full h-96">
          <Loading />
        </div>
      </ClientLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ClientLayout>
        <div className="flex flex-col justify-center items-center w-full h-96 p-8 text-center">
          <div className="text-8xl text-red-500 mb-4">
            <FiAlertOctagon />
          </div>
          <span className="text-xl text-red-500">Veuillez vous connecter pour acceder au tableau de bord.</span>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="flex flex-col justify-center items-center w-full h-96 p-8 text-center">
          <div className="text-8xl text-red-500 mb-4">
            <FiAlertOctagon />
          </div>
          <span className="text-xl text-red-500 mb-4">{error}</span>
          <button
            type="button"
            onClick={refreshData}
            className="action-button px-6 py-3 rounded-lg border transition-colors duration-300 flex items-center space-x-2 client-theme-button"
          >
            <FiRefreshCw className="animate-spin" />
            <span>Reessayer</span>
          </button>
        </div>
      </ClientLayout>
    );
  }

  const currentUser = enhancedUser || user;
  const displayName = [currentUser?.name ?? "", currentUser?.surname ?? ""].join(" ").trim();
  const activities = getRecentActivity();
  const statsData = [
    { label: "Commandes", value: enhancedUser?.stats.totalCommandes || 0 },
    { label: "Favoris", value: enhancedUser?.stats.totalFavorites || 0 },
    { label: "Livrees", value: enhancedUser?.stats.commandesLivrees || 0 },
  ];
  const maxStat = Math.max(...statsData.map((item) => item.value), 1);

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="backdrop-blur-xl rounded-lg p-5 border client-theme-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold client-theme-text-primary mb-1">Tableau de bord</h1>
              <p className="client-theme-text-secondary text-sm">
                {displayName ? `Bienvenue, ${displayName}` : "Bienvenue"}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4 client-theme-text-secondary text-sm">
              <div className="flex items-center space-x-2">
                <FiUser className="text-lg" />
                <span>{currentUser?.name} {currentUser?.surname}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="text-lg" />
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-lg" />
                <span>{formatDate(new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={<FiShoppingCart className="text-2xl client-theme-text-primary" />}
            value={recentAchats.length.toString()}
            label="Total Achats"
            iconClassName="client-theme-icon-soft"
          />
          <StatCard
            icon={<FaCar className="text-2xl client-theme-text-primary" />}
            value={(enhancedUser?.stats.totalCommandes || 0).toString()}
            label="Commandes"
            iconClassName="client-theme-icon-soft"
          />
          <StatCard
            icon={<FiHeart className="text-2xl client-theme-text-primary" />}
            value={(enhancedUser?.stats.totalFavorites || 0).toString()}
            label="Favoris"
            iconClassName="client-theme-icon-soft"
          />
          <StatCard
            icon={<FiDollarSign className="text-2xl client-theme-text-primary" />}
            value={formatCurrency(enhancedUser?.stats.montantTotalCommandes || 0)}
            label="Montant Total"
            iconClassName="client-theme-icon-soft"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border backdrop-blur-xl p-5 client-theme-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold client-theme-text-primary flex items-center">
                <FiClock className="mr-2" />
                Activite Recente
              </h2>
              <FiTrendingUp className="client-theme-accent-text" />
            </div>

            <div className="space-y-3">
              {activities.map((activity) => (
                <ActivityItem
                  key={`${activity.type}-${activity.date}-${activity.title}`}
                  item={activity}
                  icon={getActivityIcon(activity.type)}
                  formattedDate={formatDate(activity.date)}
                  formattedAmount={activity.amount ? formatCurrency(activity.amount) : undefined}
                />
              ))}

              {activities.length === 0 && (
                <EmptyState
                  compact
                  title="Aucune activite recente"
                  message="Vos achats, commandes et favoris recents apparaitront ici."
                />
              )}
            </div>
          </div>

          <div className="rounded-lg border backdrop-blur-xl p-5 client-theme-card">
            <h2 className="text-base font-semibold client-theme-text-primary mb-5 flex items-center">
              <FiUser className="mr-2" />
              Apercu du Compte
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border client-theme-card-soft flex justify-between items-center">
                <span className="client-theme-text-secondary">Commandes en cours</span>
                <span className="client-theme-value font-medium">{enhancedUser?.stats.commandesEnCours || 0}</span>
              </div>
              <div className="p-4 rounded-lg border client-theme-card-soft flex justify-between items-center">
                <span className="client-theme-text-secondary">Commandes livrees</span>
                <span className="client-theme-value font-medium">{enhancedUser?.stats.commandesLivrees || 0}</span>
              </div>
              <div className="p-4 rounded-lg border client-theme-card-soft flex justify-between items-center">
                <span className="client-theme-text-secondary">Membre depuis</span>
                <span className="client-theme-text-primary font-medium">{formatDate(enhancedUser?.createdAt)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-lg border client-theme-card-soft p-4">
              <p className="text-sm client-theme-text-primary mb-3 font-medium">Tendance des activites</p>
              <div className="space-y-3">
                {statsData.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs client-theme-text-secondary mb-1">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-2 rounded-lg overflow-hidden client-theme-card">
                      <div className={`h-full rounded-lg client-theme-progress ${getBarWidthClass(item.value, maxStat)}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default DashboardPage;
