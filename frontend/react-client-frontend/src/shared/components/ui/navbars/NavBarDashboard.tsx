import { useState } from "react";
import { FiSearch, FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../router";
import useAuth from "../../../hooks/useAuth";
import FormName from "../../../utils/helpers";

function NavBarDashboard() {
    const { user, isAuthenticated, loading } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate(ROUTES.LOGOUT);
        setIsDropdownOpen(false);
    };

    const handleNavigation = (route: string) => {
        navigate(route);
        setIsDropdownOpen(false);
    };

    if (isAuthenticated && !loading) {
        return (
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-md border-b border-blue-700/30 shadow-lg">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="pl-12 lg:pl-0">
                                <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text">
                                    CarHub
                                </h1>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-blue-300" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full pl-10 pr-4 py-2 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="text-blue-200 hover:text-white p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-600/50 transition-all duration-300 transform hover:scale-105 relative">
                                <FiBell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 text-sm text-white focus:outline-none hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-600/50 p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <FiUser className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="hidden lg:block">
                                        {FormName(user?.name ?? "", user?.surname ?? "")}
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-blue-900/95 to-blue-800/95 backdrop-blur-md rounded-lg shadow-xl border border-blue-700/30 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="py-1">
                                            <button
                                                onClick={() => handleNavigation(ROUTES.PROFILE)}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-600/50 transition-all duration-300"
                                            >
                                                <FiUser className="mr-3 w-4 h-4" />
                                                Mon Profil
                                            </button>
                                            <button
                                                onClick={() => handleNavigation(ROUTES.PARAMETRES)}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-600/50 transition-all duration-300"
                                            >
                                                <FiSettings className="mr-3 w-4 h-4" />
                                                Paramètres
                                            </button>
                                            <hr className="border-blue-700/30 my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-200 hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300"
                                            >
                                                <FiLogOut className="mr-3 w-4 h-4" />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden pb-4">
                        <div className="pt-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-blue-300" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full pl-10 pr-4 py-2 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                )}
            </div>
        );
    }
}

export default NavBarDashboard;