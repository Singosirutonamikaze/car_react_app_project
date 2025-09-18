import { useState, useEffect } from 'react';
import { FiPackage, FiHeart, FiDollarSign, FiTrendingUp, FiAlertOctagon } from "react-icons/fi";
import ClientLayout from "../../../shared/components/layouts/ClientLayout";
import Loading from "../../../shared/components/ui/Loading";
import useAuth from "../../../shared/hooks/useAuth";
import type { DashboardStats } from '../../../shared/types/client';
import clientService from '../../../shared/services/clientService';

function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await clientService.getDashboardStats();
        setStats(data);
      } catch {
        setError('Erreur lors du chargement des données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center w-full h-auto">
          <Loading />
        </div>
      </ClientLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ClientLayout>
        <div className="flex flex-col justify-center items-center w-full h-screen p-8 text-center">
          <div className="text-9xl text-red-500 mb-4">
            <FiAlertOctagon />
          </div>
          <span className="text-xl text-red-500">
            Veuillez vous connecter pour accéder au tableau de bord.
          </span>
        </div>
      </ClientLayout>
    );
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center w-full h-auto">
          <Loading />
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="flex flex-col justify-center items-center w-full h-screen p-8 text-center">
          <div className="text-9xl text-red-500 mb-4">
            <FiAlertOctagon />
          </div>
          <span className="text-xl text-red-500">
            {error}
          </span>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="dashboard-page">
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-blue-200 mb-8">Bienvenue, {user?.name} {user?.surname}</p>

        {/* Cartes de statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-blue-500">
              <FiPackage className="text-white text-2xl" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalOrders || 0}</h3>
              <p className="stat-label">Commandes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-pink-500">
              <FiHeart className="text-white text-2xl" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalFavorites || 0}</h3>
              <p className="stat-label">Favoris</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-green-500">
              <FiDollarSign className="text-white text-2xl" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalPurchases || 0}</h3>
              <p className="stat-label">Achats</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-purple-500">
              <FiTrendingUp className="text-white text-2xl" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats?.balance ? `${stats.balance} €` : '0 €'}</h3>
              <p className="stat-label">Solde</p>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2 className="text-2xl font-bold text-white mb-4">Activité récente</h2>
          <div className="activity-list">
           
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default DashboardPage;