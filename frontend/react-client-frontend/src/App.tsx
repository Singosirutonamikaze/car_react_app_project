import ROUTES from './router';
import './index.css';
import './styles/globals.css';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { applyStoredClientTheme } from './shared/utils';

//Pages
import CommandesPage from './app/client-dashboard/pages/CommandesPage';
import PanierPage from './app/client-dashboard/pages/PanierPage';
import FavorisPage from './app/client-dashboard/pages/FavorisPage';
import LocationsPage from './app/client-dashboard/pages/LocationsPage';
import DashboardPage from './app/client-dashboard/pages/DashboardPage';
import ProfilPage from './app/client-dashboard/pages/ProfilPage';
import ParametresPage from './app/client-dashboard/pages/ParametresPage';
import StatistiquesPage from './app/client-dashboard/pages/StatistiquesPage';
import StatistiquesCourbesPage from './app/client-dashboard/pages/StatistiquesCourbesPage';
import ContactPage from './app/presentation/pages/ContactPage';
import AProposPage from './app/presentation/pages/AProposPage';
import AccueilPage from './app/presentation/pages/AccueilPage';
import VoituresPage from './app/presentation/pages/VoituresPage';
import RecherchePage from './app/presentation/pages/RecherchePage';
import ConnexionPage from './app/auth/pages/ConnexionPage';
import InscriptionPage from './app/auth/pages/InscriptionPage';
import CarDetailsPage from './app/presentation/pages/CarDetailsPage';
import LoaderPage from './app/common/LoaderPage';
import NotFoundPage from './app/common/NotFoundPage';
import { AuthProvider } from './shared/contexts/UserProvider';

function App() {
  useEffect(() => {
    applyStoredClientTheme();
  }, []);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<AccueilPage />} />
          <Route path={ROUTES.ABOUT} element={<AProposPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.LOADER} element={<LoaderPage />} />
          <Route path={ROUTES.CAR_DETAILS} element={<CarDetailsPage />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.FAVORITES} element={<FavorisPage />} />
          <Route path={ROUTES.CART} element={<PanierPage />} />
          <Route path={ROUTES.LOCATIONS} element={<LocationsPage />} />
          <Route path={ROUTES.ORDERS} element={<CommandesPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilPage />} />
          <Route path={ROUTES.PARAMETRES} element={<ParametresPage />} />
          <Route path={ROUTES.STATS} element={<StatistiquesPage />} />
          <Route path={ROUTES.STATS_TRENDS} element={<StatistiquesCourbesPage />} />
          <Route path={ROUTES.CARS} element={<VoituresPage />} />
          <Route path={ROUTES.SEARCH} element={<RecherchePage />} />
          <Route path={ROUTES.LOGIN} element={<ConnexionPage />} />
          <Route path={ROUTES.SIGNUP} element={<InscriptionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="slate"
      />
    </>
  )
}

export default App
