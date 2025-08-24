import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPath';
import { addThousandSeparator } from '../../utils/helper';
import {
  LuCar,
  LuUsers,
  LuClipboard,
  LuShoppingCart,
  LuDollarSign,
  LuTrendingUp,
  LuCalendar,
  LuActivity
} from 'react-icons/lu';
import InformationCardStats from '../components/cards/InformationCardStats';
import StatsCardOverview from '../components/cards/StatsCardOverview';
import DashboardOverviewStats from '../components/cards/DashboardOverviewStats';
import LastCommandesChart from '../components/Dashboard/LastCommandesChart';
import axiosInstance from '../../service/axiosInstance';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DASHBOARD_DATA
      );

      if (response.data) {
        setDashboardData(response.data);
        console.log('Dashboard data:', response.data);
      }
    } catch (error) {
      console.error('Erreur dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full h-full flex items-center justify-center bg-[#010B18]/70 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
            <p className="text-slate-100/80 text-lg">Chargement des données...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#010B18] via-[#010B18]/95 to-[#010B18]/90 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-violet-200 to-violet-400 
                                 bg-clip-text text-transparent mb-2">
            Tableau de Bord
          </h1>
          <p className="text-slate-300">Aperçu de votre activité CarsHub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InformationCardStats
            icon={<LuUsers className="text-2xl" />}
            label="Total Clients"
            value={addThousandSeparator(dashboardData?.clients?.total || 0)}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          />

          <InformationCardStats
            icon={<LuCar className="text-2xl" />}
            label="Total Voitures"
            value={addThousandSeparator(dashboardData?.voitures?.total || 0)}
            color="bg-gradient-to-r from-green-500 to-green-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-green-500/20 transition-all duration-300"
          />

          <InformationCardStats
            icon={<LuShoppingCart className="text-2xl" />}
            label="Total Ventes"
            value={addThousandSeparator(dashboardData?.ventes?.total || 0)}
            color="bg-gradient-to-r from-violet-500 to-violet-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
          />

          <InformationCardStats
            icon={<LuClipboard className="text-2xl" />}
            label="Total Commandes"
            value={addThousandSeparator(dashboardData?.commandes?.total || 0)}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatsCardOverview
            icon={<LuDollarSign className="text-xl text-white" />}
            label="Revenu Total"
            value={addThousandSeparator(dashboardData?.statistiques?.revenueTotal || 0)}
            color="bg-gradient-to-r from-cyan-500 to-cyan-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
          />

          <StatsCardOverview
            icon={<LuCar className="text-2xl" />}
            label="Voitures Louées"
            value={addThousandSeparator(dashboardData?.voitures?.loue || 0)}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          />

          <StatsCardOverview
            icon={<LuClipboard className="text-2xl" />}
            label="Ventes (30j)"
            value={addThousandSeparator(dashboardData?.statistiques?.ventes30Jours || 0)}
            color="bg-gradient-to-r from-pink-500 to-pink-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
          />

          <StatsCardOverview
            icon={<LuActivity className="text-2xl" />}
            label="Revenu (30j)"
            value={addThousandSeparator(dashboardData?.statistiques?.revenue30Jours || 0)}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            textColor="text-white"
            className="bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 
                                 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commandes récentes */}
          <div className='card'>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 
                                          rounded-lg flex items-center justify-center">
                <LuClipboard className="text-lg text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Commandes Récentes</h3>
            </div>

            <div className="space-y-3 h-auto">
              {dashboardData?.commandes?.recentes?.slice(0, 5).map((commande, index) => (
                <div key={index} className="flex items-center justify-between p-3 
                                                         bg-slate-100/5 rounded-xl border border-slate-100/5
                                                         hover:bg-slate-100/10 transition-colors duration-200">
                  <div className="flex-1">
                    <p className="text-slate-100 font-medium">
                      {commande?.client?.nomComplet}
                    </p>
                    <p className="text-slate-300 text-sm">
                      {commande?.voiture?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-100 font-semibold">
                      {addThousandSeparator(commande?.montantTotal || 0)} Frcfa
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${commande?.statut === 'Confirmée' ? 'bg-green-500/20 text-green-300' :
                      commande?.statut === 'En attente' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                      {commande?.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='card'>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-violet-600 
                                          rounded-lg flex items-center justify-center">
                <LuShoppingCart className="text-lg text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Ventes Récentes</h3>
            </div>
            {
              dashboardData?.ventes?.recentes?.length > 0 ? (
                <div className="space-y-3 max-h-full overflow-y-auto">
                  {dashboardData?.ventes?.recentes?.slice(0, 5).map((vente, index) => (
                    <div key={index} className="flex items-center justify-between p-3 
                                                           bg-slate-100/5 rounded-xl border border-slate-100/5
                                                           hover:bg-slate-100/10 transition-colors duration-200">
                      <div className="flex-1">
                        <p className="text-slate-100 font-medium">
                          {vente?.client?.nomComplet}
                        </p>
                        <p className="text-slate-300 text-sm">
                          {vente?.voiture?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-100 font-semibold">
                          {addThousandSeparator(vente?.prixVente || 0)} Frcfa
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${vente?.statut === 'Payée' ? 'bg-green-500/20 text-green-300' :
                          vente?.statut === 'En attente' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                          {vente?.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 text-2xl  flex items-center justify-center mt-20">Aucune vente récente</p>
              )
            }
          </div>

          <DashboardOverviewStats
            totalClients={dashboardData?.clients?.total || 0}
            totalCars={dashboardData?.voitures?.total || 0}
            totalOrders={dashboardData?.commandes?.total || 0}
            totalSales={dashboardData?.ventes?.total || 0}
          />

          <LastCommandesChart
            data={dashboardData?.commandes?.recentes || []}
          />

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;