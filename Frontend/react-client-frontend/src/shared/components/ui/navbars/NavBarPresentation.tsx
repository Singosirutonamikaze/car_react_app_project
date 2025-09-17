import { useEffect, useState } from "react";
import { PRESENTATION_NAVBAR_DATA } from "../../../utils/data";
import { useNavigate } from "react-router";

interface NavBarPresentationProps {
    activeItem?: string;
}

function NavBarPresentation({ activeItem: initialActiveItem }: NavBarPresentationProps) {
    const navdatas = PRESENTATION_NAVBAR_DATA;
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(initialActiveItem || 'Accueil');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavClick = (path: string) => {
        setActiveItem(path);
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    useEffect(() => {
        setActiveItem(initialActiveItem || 'Accueil');
    }, [initialActiveItem]);

    return (
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-xl backdrop-blur-md border-b border-blue-700/30 fixed w-full z-50 mb-5">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text">
                            CarHub
                        </h1>
                    </div>

                    <div className="hidden md:block">
                        <nav>
                            <ul className="flex space-x-1">
                                {navdatas.map((item) => {
                                    const IconComponent = item.icon;
                                    const isActive = activeItem === item.path;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => handleNavClick(item.path)}
                                                className={`group flex items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out backdrop-blur-sm border hover:shadow-lg hover:shadow-blue-500/25 ${isActive
                                                    ? 'text-white bg-blue-600/70 border-blue-400/50 shadow-lg shadow-blue-500/30'
                                                    : 'text-blue-100 hover:text-white hover:bg-blue-700/50 border-transparent hover:border-blue-400/30'
                                                    }`}
                                            >
                                                <IconComponent className={`w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300 ${isActive ? 'text-blue-200' : ''}`} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>

                    <div className="md:hidden">
                        <button
                            className="text-blue-100 hover:text-white p-2 rounded-lg hover:bg-blue-700/50 transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <nav>
                            <ul className="space-y-2">
                                {navdatas.map((item) => {
                                    const IconComponent = item.icon;
                                    const isActive = activeItem === item.path;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => handleNavClick(item.path)}
                                                className={`group flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 ease-in-out backdrop-blur-sm border ${isActive
                                                    ? 'text-white bg-blue-600/70 border-blue-400/50 shadow-lg shadow-blue-500/30'
                                                    : 'text-blue-100 hover:text-white hover:bg-blue-700/50 border-transparent hover:border-blue-400/30'
                                                    }`}
                                            >
                                                <IconComponent className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavBarPresentation;