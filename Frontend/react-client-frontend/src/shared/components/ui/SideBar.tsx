import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FiHome,
    FiHeart,
    FiShoppingCart,
    FiUser,
    FiSettings,
    FiFileText,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
    FiX,
    FiLogOut
} from "react-icons/fi";
import ROUTES from "../../../router";

function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const menuItems = [
        { path: ROUTES.DASHBOARD, label: "Tableau de bord", icon: <FiHome className="w-5 h-5" /> },
        { path: ROUTES.FAVORITES, label: "Favoris", icon: <FiHeart className="w-5 h-5" /> },
        { path: ROUTES.CART, label: "Panier", icon: <FiShoppingCart className="w-5 h-5" /> },
        { path: ROUTES.ORDERS, label: "Commandes", icon: <FiFileText className="w-5 h-5" /> },
        { path: ROUTES.PROFILE, label: "Profil", icon: <FiUser className="w-5 h-5" /> },
        { path: ROUTES.PARAMETRES, label: "Paramètres", icon: <FiSettings className="w-5 h-5" /> },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

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
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg lg:hidden transition-all duration-300 transform hover:scale-105"
            >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            <div className={`
                fixed lg:static top-0 left-0 h-screen z-50
                bg-gradient-to-b from-blue-500/20 to-blue-600/20 backdrop-blur-md 
                border-r border-blue-700/30 shadow-lg flex flex-col
                transition-all duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} 
                w-64
            `}>
                <div className="flex items-center justify-between p-4 border-b border-blue-700/30">
                    {(!isCollapsed || isMobile) && (
                        <h2 className="text-lg font-semibold text-white">Navigation</h2>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-600/50 transition-all duration-300 transform hover:scale-105 hidden lg:block"
                    >
                        {isCollapsed ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleMenuItemClick(item.path)}
                            className={`w-full flex items-center rounded-lg p-3  transition-all duration-300 transform hover:scale-105 ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-600/50'
                                }`}
                        >
                            <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                            {(!isCollapsed || isMobile) && (
                                <span className="ml-3 font-medium">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-blue-700/30">
                    <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
                        {(!isCollapsed || isMobile) && (
                            <div className="text-sm text-blue-200">
                                <p>CarHub Client</p>
                            </div>
                        )}
                        <button
                            onClick={handleDeconnexion}
                            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-600/50 transition-all duration-300 transform hover:scale-105"
                            title="Déconnexion"
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