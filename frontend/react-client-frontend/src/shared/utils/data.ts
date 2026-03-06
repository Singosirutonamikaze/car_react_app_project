import { FaHome } from 'react-icons/fa';
import { 
    LuCar, 
    LuSearch, 
    LuInfo, 
    LuPhone,
    LuUserPlus,
    LuLogIn, 
    LuLayoutDashboard, 
    LuHeart, 
    LuShoppingCart, 
    LuClipboard, 
    LuUser, 
    LuSettings, 
    LuLogOut 
} from 'react-icons/lu';

export const PRESENTATION_NAVBAR_DATA = [
    { 
        id: 1,
        label: 'Accueil', 
        icon: FaHome, 
        path: '/home' 
    },
    { 
        id: 2, 
        label: 'Nos Voitures', 
        icon: LuCar, 
        path: '/voitures' 
    },
    { 
        id: 3, 
        label: 'Recherche', 
        icon: LuSearch, 
        path: '/recherche' 
    },
    { 
        id: 4, 
        label: 'À propos', 
        icon: LuInfo, 
        path: '/a-propos' 
    },
    { 
        id: 5, 
        label: 'Contact', 
        icon: LuPhone, 
        path: '/contact' 
    },
    { 
        id: 6, 
        label: 'S\'inscrire', 
        icon: LuUserPlus, 
        path: '/inscription' 
    },
    { 
        id: 7, 
        label: 'Se connecter', 
        icon: LuLogIn, 
        path: '/connexion' 
    }
];

export const CLIENT_DASHBOARD_NAVBAR_DATA = [
    { 
        id: 1, 
        label: 'Tableau de bord', 
        icon: LuLayoutDashboard, 
        path: '/client/dashboard' 
    },
    { 
        id: 2, 
        label: 'Mes Favoris', 
        icon: LuHeart, 
        path: '/client/favoris' 
    },
    { 
        id: 3, 
        label: 'Mon Panier', 
        icon: LuShoppingCart, 
        path: '/client/panier' 
    },
    { 
        id: 4, 
        label: 'Mes Commandes', 
        icon: LuClipboard, 
        path: '/client/commandes' 
    },
    { 
        id: 5, 
        label: 'Mon Profil', 
        icon: LuUser, 
        path: '/client/profil' 
    },
    { 
        id: 6, 
        label: 'Paramètres', 
        icon: LuSettings, 
        path: '/client/parametres' 
    },
    { 
        id: 7, 
        label: 'Déconnexion', 
        icon: LuLogOut, 
        path: '/logout' 
    }
];