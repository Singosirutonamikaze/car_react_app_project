import "./index.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserProvider";
import Rout from "./pages/root/Rout";
import Login from "./pages/auth/Login";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClientsPage from "./pages/clients/ClientsPage";
import CarsPage from "./pages/cars/CarsPage";
import SalesPage from "./pages/sales/SalesPage";
import CommandsPage from "./pages/commands/CommandsPage";
import AchatsPage from "./pages/achats/AchatsPage";
import LocationsPage from "./pages/locations/LocationsPage";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import { ROUTES } from "./utils/routes";
import { TOASTER_OPTIONS } from "./utils/uiConfig";

const routes = [
  { path: ROUTES.HOME, element: <Rout /> },
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
  { path: ROUTES.CLIENTS, element: <ClientsPage /> },
  { path: ROUTES.CARS, element: <CarsPage /> },
  { path: ROUTES.SALES, element: <SalesPage /> },
  { path: ROUTES.ORDERS, element: <CommandsPage /> },
  { path: ROUTES.ACHATS, element: <AchatsPage /> },
  { path: ROUTES.LOCATIONS, element: <LocationsPage /> },
  { path: ROUTES.FAVORITES, element: <FavoritesPage /> },
];
const AppRoutes = (
  <Routes>
    {routes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Routes>
);

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-linear-to-br from-[#031827] via-[#052740] to-[#021624]">
        {AppRoutes}
        <Toaster position="top-right" toastOptions={TOASTER_OPTIONS} />
      </div>
    </UserProvider>
  );
}

export default App;
