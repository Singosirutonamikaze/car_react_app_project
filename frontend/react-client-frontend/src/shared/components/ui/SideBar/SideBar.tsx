import { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiHeart,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

import ROUTES from "../../../../router";

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(globalThis.innerWidth < 1024);
    };

    checkScreenSize();
    globalThis.addEventListener("resize", checkScreenSize);

    return () => globalThis.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { path: ROUTES.DASHBOARD, label: "Tableau de bord", icon: <FiHome className="w-5 h-5" /> },
    { path: ROUTES.FAVORITES, label: "Favoris", icon: <FiHeart className="w-5 h-5" /> },
    { path: ROUTES.CART, label: "Panier", icon: <FiShoppingCart className="w-5 h-5" /> },
    { path: ROUTES.ORDERS, label: "Commandes", icon: <FiFileText className="w-5 h-5" /> },
    { path: ROUTES.STATS, label: "Statistiques", icon: <FiBarChart2 className="w-5 h-5" /> },
    { path: ROUTES.STATS_TRENDS, label: "Tendances", icon: <FiBarChart2 className="w-5 h-5" /> },
    { path: ROUTES.PROFILE, label: "Profil", icon: <FiUser className="w-5 h-5" /> },
    { path: ROUTES.PARAMETRES, label: "Parametres", icon: <FiSettings className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleDeconnexion = () => {
    navigate(ROUTES.LOGOUT);
    setIsMobileMenuOpen(false);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Fermer le menu mobile"
        />
      )}

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg text-white shadow-lg lg:hidden transition-all duration-300 transform hover:scale-105 client-accent-bg-strong"
      >
        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      <div
        className={`fixed lg:sticky lg:top-0 top-0 left-0 h-screen z-50 backdrop-blur-md border-r shadow-lg flex flex-col transition-all duration-300 ease-in-out client-sidebar-gradient ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${isCollapsed ? "lg:w-16" : "lg:w-64"} w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b client-border-b">
          {(!isCollapsed || isMobile) && <h2 className="text-lg font-semibold text-white">Navigation</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg transition-all duration-300 transform hover:scale-105 hidden lg:block client-theme-outline-button"
          >
            {isCollapsed ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMenuItemClick(item.path)}
              className={`w-full flex items-center rounded-lg p-3 transition-all duration-300 transform hover:scale-105 ${isActive(item.path) ? "client-active-item" : "client-inactive-item"}`}
            >
              <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
              {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t client-border-t">
          <div className={`flex items-center ${isCollapsed && !isMobile ? "justify-center" : "justify-between"}`}>
            {(!isCollapsed || isMobile) && (
              <div className="text-sm client-theme-text-secondary">
                <p>CarHub Client</p>
              </div>
            )}
            <button
              onClick={handleDeconnexion}
              className="p-2 rounded-lg transition-all duration-300 transform hover:scale-105 client-theme-outline-button"
              title="Deconnexion"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
