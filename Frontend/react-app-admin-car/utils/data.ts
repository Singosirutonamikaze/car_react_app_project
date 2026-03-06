import {
    LuCar,
    LuUsers,
    LuClipboard,
    LuLogOut,
    LuLayoutDashboard,
    LuOctagon,
} from 'react-icons/lu';

export const SIDE_MENU_DATA = [
    {
        id: '01',
        label: 'Dashboard',
        icon: LuLayoutDashboard,
        path: '/dashboard',
    },
    {
        id: '02',
        label: 'Liste des Clients',
        icon: LuUsers,
        path: '/clients',
    },
    {
        id: '03',
        label: 'Liste des Voitures',
        icon: LuCar,
        path: '/cars',
    },
    {
        id: '04',
        label: 'Liste des Ventes',
        icon: LuOctagon,
        path: '/sales',
    },
    {
        id: '05',
        label: 'Liste des Commandes',
        icon: LuClipboard,
        path: '/orders',
    },
    {
        id: '06',
        label: 'Déconnexion',
        icon: LuLogOut,
        path: 'logout',
    }
];