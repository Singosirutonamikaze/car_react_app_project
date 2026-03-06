import { FiAlertOctagon, FiShoppingCart, FiHeart, FiDollarSign, FiTrendingUp, FiClock, FiUser, FiMail, FiCalendar, FiRefreshCw } from "react-icons/fi";
import ClientLayout from "../../../shared/components/layouts/ClientLayout";
import Loading from "../../../shared/components/ui/Loading";
import useAuth from "../../../shared/hooks/useAuth";
import useUser from "../../../shared/hooks/useUser";
import { FaCar } from "react-icons/fa";
import type { AchatInfo, CommandeInfo, FavoriInfo } from "../../../shared/types/dashboard";

interface ActivityItem {
  type: 'achat' | 'commande' | 'favori';
  title: string;
  date: string;
  amount?: number;
}

function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const {
    enhancedUser,
    achats,
    loading: dashboardLoading,
    error,
    refreshData
  } = useUser();

  const dataLoading = authLoading || dashboardLoading;
  const recentAchats = achats?.achats || [];

  // Fonctions utilitaires
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "Date invalide";
    }
  };

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${amount.toLocaleString()} FCFA`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achat':
        return <FiShoppingCart className="text-green-500" />;
      case 'favori':
        return <FiHeart className="text-red-500" />;
      case 'commande':
        return <FaCar className="text-blue-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getRecentActivity = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Ajouter les achats récents
    recentAchats.slice(0, 3).forEach((achat: AchatInfo) => {
      if (achat.voiture) {
        activities.push({
          type: 'achat',
          title: `${achat.voiture.marque || 'Voiture'} ${achat.voiture.modele || ''} (${achat.voiture.annee || ''})`.trim(),
          date: achat.dateAchat,
          amount: achat.prixAchat
        });
      }
    });

    // Ajouter les commandes récentes
    enhancedUser?.recentCommandes.slice(0, 2).forEach((commande: CommandeInfo) => {
      if (commande.voiture) {
        activities.push({
          type: 'commande',
          title: `Commande - ${commande.voiture.marque || 'Voiture'} ${commande.voiture.modele || ''}`.trim(),
          date: commande.dateCommande,
          amount: commande.montantTotal
        });
      }
    });

    // Ajouter les favoris récents
    enhancedUser?.recentFavorites.slice(0, 2).forEach((favori: FavoriInfo) => {
      if (favori.voiture) {
        activities.push({
          type: 'favori',
          title: `${favori.voiture.marque || 'Voiture'} ${favori.voiture.modele || ''} ajouté aux favoris`.trim(),
          date: favori.dateAjout
        });
      }
    });

    return activities
      .filter(activity => activity.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  // Gestion des états de chargement
  if (dataLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center w-full h-96">
          <Loading />
        </div>
      </ClientLayout>
    );
  }

  // Gestion de l'authentification
  if (!isAuthenticated) {
    return (
      <ClientLayout>
        <div className="flex flex-col justify-center items-center w-full h-96 p-8 text-center">
          <div className="text-8xl text-red-500 mb-4">
            <FiAlertOctagon />
          </div>
          <span className="text-xl text-red-500">
            Veuillez vous connecter pour accéder au tableau de bord.
          </span>
        </div>
      </ClientLayout>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <ClientLayout>
        <div className="flex flex-col justify-center items-center w-full h-96 p-8 text-center">
          <div className="text-8xl text-red-500 mb-4">
            <FiAlertOctagon />
          </div>
          <span className="text-xl text-red-500 mb-4">{error}</span>
          <button
            onClick={refreshData}
            className="action-button px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
          >
            <FiRefreshCw className="animate-spin" />
            <span>Réessayer</span>
          </button>
        </div>
      </ClientLayout>
    );
  }

  const currentUser = enhancedUser || user;

  return (
    <ClientLayout>
      <div className="dashboard-page">
        {/* En-tête de bienvenue */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Tableau de bord
              </h1>
              <p className="text-blue-200 text-lg">
                Bienvenue, {currentUser?.name} {currentUser?.surname} 👋
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-blue-200">
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

        {/* Grille des statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-green-500/20">
              <FiShoppingCart className="text-2xl text-green-500" />
            </div>
            <div className="stat-content">
              <h3>{dataLoading ? <div className="loading-stat"></div> : recentAchats.length.toString()}</h3>
              <p className="stat-label">Total Achats</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-blue-500/20">
              <FaCar className="text-2xl text-blue-500" />
            </div>
            <div className="stat-content">
              <h3>{dataLoading ? <div className="loading-stat"></div> : (enhancedUser?.stats.totalCommandes || 0).toString()}</h3>
              <p className="stat-label">Commandes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-red-500/20">
              <FiHeart className="text-2xl text-red-500" />
            </div>
            <div className="stat-content">
              <h3>{dataLoading ? <div className="loading-stat"></div> : (enhancedUser?.stats.totalFavorites || 0).toString()}</h3>
              <p className="stat-label">Favoris</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-yellow-500/20">
              <FiDollarSign className="text-2xl text-yellow-500" />
            </div>
            <div className="stat-content">
              <h3 className="currency-fcfa">
                {dataLoading ? <div className="loading-stat"></div> : formatCurrency(enhancedUser?.stats.montantTotalCommandes || 0)}
              </h3>
              <p className="stat-label">Montant Total</p>
            </div>
          </div>
        </div>

        {/* Activité récente et aperçu du compte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Activité récente */}
          <div className="recent-activity">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FiClock className="mr-2" />
                Activité Récente
              </h2>
              <div className="flex items-center space-x-2">
                <FiTrendingUp className="text-blue-400" />
                {dataLoading && <FiRefreshCw className="text-blue-400 animate-spin" />}
              </div>
            </div>

            {dataLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="loading-activity"></div>
                ))}
              </div>
            ) : (
              <div className="activity-list">
                {getRecentActivity().map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.title}</p>
                      <p className="activity-date">
                        {formatDate(activity.date)}
                        {activity.amount && (
                          <span className="ml-2 text-green-400 font-semibold currency-fcfa">
                            {formatCurrency(activity.amount)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {getRecentActivity().length === 0 && (
                  <div className="text-center py-8 text-blue-200">
                    <FiClock className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>Aucune activité récente</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section Aperçu du compte */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FiUser className="mr-2" />
              Aperçu du Compte
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Commandes en cours</span>
                  <span className="text-orange-400 font-medium">
                    {enhancedUser?.stats.commandesEnCours || 0}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Commandes livrées</span>
                  <span className="text-green-400 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {enhancedUser?.stats.commandesLivrees || 0}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Membre depuis</span>
                  <span className="text-white font-medium">
                    {formatDate(enhancedUser?.createdAt)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Dernière commande</span>
                  <span className="text-white font-medium">
                    {enhancedUser?.lastCommande ?
                      formatDate(enhancedUser.lastCommande.dateCommande) :
                      'Aucune'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-lg font-medium text-white mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.location.href = '/voitures'}
                  className="action-button p-3 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FaCar />
                  <span>Voir Voitures</span>
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard/favoris'}
                  className="action-button p-3 bg-green-600/80 hover:bg-green-600 rounded-lg text-white text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FiHeart />
                  <span>Mes Favoris</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section statistiques additionnelles */}
        {enhancedUser && enhancedUser.stats && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FiTrendingUp className="mr-2" />
              Statistiques Détaillées
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {enhancedUser.stats.commandesLivrees}
                </div>
                <div className="text-blue-200">Commandes Livrées</div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {enhancedUser.stats.commandesEnCours}
                </div>
                <div className="text-blue-200">En Cours</div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {enhancedUser.stats.commandesAnnulees || 0}
                </div>
                <div className="text-blue-200">Annulées</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

export default DashboardPage;